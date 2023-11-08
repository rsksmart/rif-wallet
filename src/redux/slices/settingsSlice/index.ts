import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSupportedBiometryType } from 'react-native-keychain'
import { ColorValue, Platform } from 'react-native'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { RifWalletServicesFetcher } from '@rsksmart/rif-wallet-services'

import { KeyManagementSystem } from 'lib/core'

import { createKMS, deleteCache, loadExistingWallet } from 'core/operations'
import { deleteDomains } from 'storage/DomainsStore'
import { deleteContacts as deleteContactsFromRedux } from 'store/slices/contactsSlice'
import { resetMainStorage } from 'storage/MainStorage'
import { deleteKeys, getKeys } from 'storage/SecureStorage'
import { sharedColors } from 'shared/constants'
import { createPublicAxios } from 'core/setup'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { deleteProfile } from 'store/slices/profileSlice'
import { navigationContainerRef } from 'core/Core'
import { initializeBitcoin } from 'core/hooks/bitcoin/initializeBitcoin'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { createKeysRouteNames } from 'navigation/createKeysNavigator'
import { AsyncThunkWithTypes } from 'store/store'
import {
  rifSockets,
  SocketsEvents,
  socketsEvents,
} from 'src/subscriptions/rifSockets'
import { ChainTypesByIdType } from 'shared/constants/chainConstants'
import { getCurrentChainId } from 'storage/ChainStorage'
import { resetReduxStorage } from 'storage/ReduxStorage'
import {
  setIsFirstLaunch,
  setKeysExist,
  setPinState,
} from 'store/slices/persistentDataSlice'

import {
  Bitcoin,
  CreateFirstWalletAction,
  OnRequestAction,
  SettingsSlice,
  UnlockAppAction,
} from './types'

const initializeApp = createAsyncThunk<
  void,
  { rifWallet: RIFWallet; mnemonic: string },
  AsyncThunkWithTypes
>('settings/initializeApp', async ({ rifWallet, mnemonic }, thunkAPI) => {
  try {
    const {
      usdPrices,
      balances,
      settings: { chainId },
    } = thunkAPI.getState()
    // create fetcher
    const fetcherInstance = new RifWalletServicesFetcher(
      createPublicAxios(chainId),
      {
        defaultChainId: chainId.toString(),
        resultsLimit: 10,
      },
    )

    // connect to sockets
    rifSockets({
      wallet: rifWallet,
      fetcher: fetcherInstance,
      dispatch: thunkAPI.dispatch,
      setGlobalError: thunkAPI.rejectWithValue,
      usdPrices,
      chainId,
      balances: balances.tokenBalances,
    })

    socketsEvents.emit(SocketsEvents.CONNECT)

    // initialize bitcoin
    const bitcoin = initializeBitcoin(
      mnemonic,
      thunkAPI.dispatch,
      fetcherInstance,
      chainId,
    )

    // set bitcoin in redux
    thunkAPI.dispatch(setBitcoinState(bitcoin))
  } catch (err) {
    thunkAPI.rejectWithValue(err)
  }
})

export const createWallet = createAsyncThunk<
  RIFWallet,
  CreateFirstWalletAction,
  AsyncThunkWithTypes
>('settings/createWallet', async ({ mnemonic, initializeWallet }, thunkAPI) => {
  try {
    const { chainId } = thunkAPI.getState().settings
    const kms = await createKMS(chainId, mnemonic, thunkAPI.dispatch)

    const supportedBiometry = await getSupportedBiometryType()

    if (Platform.OS === 'android' && !supportedBiometry) {
      setTimeout(() => {
        navigationContainerRef.navigate(rootTabsRouteNames.CreateKeysUX, {
          screen: createKeysRouteNames.CreatePIN,
          params: {
            isChangeRequested: true,
            backScreen: null,
          },
        })
      }, 100)
    }

    if (!kms) {
      return thunkAPI.rejectWithValue('Failed to createKMS')
    }

    // set wallet and walletIsDeployed in WalletContext
    initializeWallet(kms.rifWallet, {
      isDeployed: kms.rifWalletIsDeployed,
      loading: false,
      txHash: null,
    })

    // unclock the app
    thunkAPI.dispatch(setUnlocked(true))

    thunkAPI.dispatch(setKeysExist(true))

    //@TODO: refactor socket initialization, it repeats several times
    thunkAPI.dispatch(setChainId(chainId))

    thunkAPI.dispatch(initializeApp({ rifWallet: kms.rifWallet, mnemonic }))

    return kms.rifWallet
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
})

export const unlockApp = createAsyncThunk<
  KeyManagementSystem,
  UnlockAppAction,
  AsyncThunkWithTypes
>('settings/unlockApp', async (payload, thunkAPI) => {
  try {
    const {
      persistentData: { isFirstLaunch },
      settings: { chainId },
    } = thunkAPI.getState()
    // if previously installed the app, remove stored encryted keys
    if (isFirstLaunch && !__DEV__) {
      await deleteKeys()
      thunkAPI.dispatch(setIsFirstLaunch(false))
      return thunkAPI.rejectWithValue('FIRST LAUNCH, DELETE PREVIOUS KEYS')
    }

    const serializedKeys = await getKeys()

    if (!serializedKeys) {
      // if keys do not exist, set to false
      thunkAPI.dispatch(setKeysExist(false))
      return thunkAPI.rejectWithValue('No Existing Keys')
    }

    // if keys do exist, set to true
    thunkAPI.dispatch(setKeysExist(true))

    const { pinUnlocked, isOffline, initializeWallet } = payload
    const supportedBiometry = await getSupportedBiometryType()

    if (Platform.OS === 'android' && !supportedBiometry && !pinUnlocked) {
      const {
        persistentData: { pin },
      } = thunkAPI.getState()

      // if there's no pin yet and biometrics removed
      !pin && thunkAPI.dispatch(resetApp())

      setTimeout(() => {
        if (isOffline) {
          navigationContainerRef.navigate(rootTabsRouteNames.OfflineScreen)
        } else {
          navigationContainerRef.navigate(rootTabsRouteNames.InitialPinScreen)
        }
      }, 100)
      return thunkAPI.rejectWithValue('Move to unlock with PIN')
    }

    if (isOffline) {
      setTimeout(() => {
        navigationContainerRef.navigate(rootTabsRouteNames.OfflineScreen)
      }, 100)
      return thunkAPI.rejectWithValue('Move to Offline Screen')
    }

    // set wallets in the store
    const existingWallet = await loadExistingWallet(
      serializedKeys,
      chainId,
      thunkAPI.dispatch,
    )

    if (!existingWallet) {
      return thunkAPI.rejectWithValue('No Existing Wallet')
    }

    const { kms, rifWallet, rifWalletIsDeployed } = existingWallet

    // set wallet and walletIsDeployed in WalletContext
    initializeWallet(rifWallet, {
      isDeployed: rifWalletIsDeployed,
      loading: false,
      txHash: null,
    })

    thunkAPI.dispatch(setUnlocked(true))

    navigationContainerRef.navigate(rootTabsRouteNames.Home)

    setTimeout(() => {
      thunkAPI.dispatch(initializeApp({ rifWallet, mnemonic: kms.mnemonic }))
    }, 1000)
    return kms
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
})

export const resetApp = createAsyncThunk(
  'settings/resetApp',
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(deleteContactsFromRedux())
      thunkAPI.dispatch(resetKeysAndPin())
      thunkAPI.dispatch(resetSocketState())
      thunkAPI.dispatch(deleteProfile())
      thunkAPI.dispatch(setPreviouslyUnlocked(false))
      thunkAPI.dispatch(setPinState(null))
      thunkAPI.dispatch(setKeysExist(false))
      resetMainStorage()
      resetReduxStorage()
      return 'deleted'
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)

// Not currently used, we'll be needed when support
// for multiple wallets
// export const addNewWallet = createAsyncThunk(
//   'settings/addNewWallet',
//   async ({ networkId }: AddNewWalletAction, thunkAPI) => {
//     try {
//       const keys = await getKeys()
//       const { chainId } = thunkAPI.getState().settings
//       if (!keys) {
//         return thunkAPI.rejectWithValue(
//           'Can not add new wallet because no KMS created.',
//         )
//       }
//       const { kms } = KeyManagementSystem.fromSerialized(keys)
//       const { rifWallet, isDeloyed } = await addNextWallet(
//         kms,
//         createRIFWalletFactory(
//           request => thunkAPI.dispatch(onRequest({ request })),
//           chainId,
//         ),
//         networkId,
//       )
//       thunkAPI.dispatch(setNewWallet({ rifWallet, isDeployed: isDeloyed }))
//       return {
//         rifWallet,
//         isDeloyed,
//       }
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err)
//     }
//   },
// )

const initialState: SettingsSlice = {
  isSetup: false,
  topColor: sharedColors.primary,
  requests: [],
  selectedWallet: '',
  loading: false,
  appIsActive: false,
  unlocked: false,
  previouslyUnlocked: false,
  fullscreen: false,
  hideBalance: false,
  bitcoin: null,
  chainId: 31,
  usedBitcoinAddresses: {},
}

const createInitialState = () => ({
  ...initialState,
  chainId: getCurrentChainId(),
})

const settingsSlice = createSlice({
  name: 'settings',
  initialState: createInitialState,
  reducers: {
    setIsSetup: (state, { payload }: PayloadAction<boolean>) => {
      state.isSetup = payload
      return state
    },
    changeTopColor: (state, action: PayloadAction<ColorValue>) => {
      state.topColor = action.payload
    },
    onRequest: (state, { payload }: PayloadAction<OnRequestAction>) => {
      state.requests.unshift(payload.request)
    },
    closeRequest: state => {
      state.requests.pop()
    },
    setChainId: (state, { payload }: PayloadAction<ChainTypesByIdType>) => {
      state.chainId = payload
    },
    setAppIsActive: (state, { payload }: PayloadAction<boolean>) => {
      state.appIsActive = payload
    },
    setUnlocked: (state, { payload }: PayloadAction<boolean>) => {
      state.unlocked = payload
    },
    setPreviouslyUnlocked: (state, { payload }: PayloadAction<boolean>) => {
      state.previouslyUnlocked = payload
    },
    // Not currently used, we'll be needed when support
    // for multiple wallets
    // switchSelectedWallet: (state, { payload }: PayloadAction<string>) => {
    //   state.selectedWallet = payload
    // },
    resetKeysAndPin: () => {
      deleteKeys()
      deleteDomains()
      deleteCache()
      return createInitialState()
    },
    setFullscreen: (state, { payload }: PayloadAction<boolean>) => {
      state.fullscreen = payload
    },
    setHideBalance: (state, { payload }: PayloadAction<boolean>) => {
      state.hideBalance = payload
    },
    setBitcoinState: (state, { payload }: PayloadAction<Bitcoin>) => {
      state.bitcoin = payload
    },
    addAddressToUsedBitcoinAddresses: (
      state,
      { payload }: PayloadAction<string>,
    ) => {
      state.usedBitcoinAddresses[payload] = payload
    },
  },
  extraReducers(builder) {
    builder.addCase(createWallet.pending, state => {
      state.loading = true
    })
    builder.addCase(createWallet.rejected, state => {
      state.loading = false
    })
    builder.addCase(createWallet.fulfilled, state => {
      state.loading = false
    })
    builder.addCase(unlockApp.pending, state => {
      state.loading = true
    })
    builder.addCase(unlockApp.rejected, state => {
      state.loading = false
    })
    builder.addCase(unlockApp.fulfilled, state => {
      state.loading = false
    })
    // builder.addCase(addNewWallet.pending, state => {
    //   state.loading = true
    // })
    // builder.addCase(addNewWallet.rejected, state => {
    //   state.loading = false
    // })
    // builder.addCase(addNewWallet.fulfilled, state => {
    //   state.loading = false
    // })
  },
})

export const {
  setIsSetup,
  changeTopColor,
  onRequest,
  closeRequest,
  setChainId,
  setAppIsActive,
  setUnlocked,
  setPreviouslyUnlocked,
  resetKeysAndPin,
  setFullscreen,
  setHideBalance,
  setBitcoinState,
  addAddressToUsedBitcoinAddresses,
} = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer

export * from './selectors'
