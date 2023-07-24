import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSupportedBiometryType } from 'react-native-keychain'
import { Platform } from 'react-native'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { RifWalletServicesFetcher } from '@rsksmart/rif-wallet-services'

import { KeyManagementSystem } from 'lib/core'

import { createKMS, deleteCache, loadExistingWallet } from 'core/operations'
import { deleteDomains } from 'storage/DomainsStore'
import { deleteContacts as deleteContactsFromRedux } from 'store/slices/contactsSlice'
import { resetMainStorage } from 'storage/MainStorage'
import { deleteKeys, getKeys } from 'storage/SecureStorage'
import { sharedColors } from 'shared/constants'
import { createPublicAxios, createRIFWalletFactory } from 'core/setup'
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

import {
  Bitcoin,
  ChainTypeEnum,
  CreateFirstWalletAction,
  OnRequestAction,
  SetKeysAction,
  SettingsSlice,
  SetWalletIsDeployedAction,
  UnlockAppAction,
} from './types'

export const createWallet = createAsyncThunk<
  RIFWallet,
  CreateFirstWalletAction,
  AsyncThunkWithTypes
>('settings/createWallet', async ({ mnemonic, networkId }, thunkAPI) => {
  try {
    const { chainId } = thunkAPI.getState().settings
    const rifWalletFactory = createRIFWalletFactory(
      request => thunkAPI.dispatch(onRequest({ request })),
      chainId,
    )
    const kms = await createKMS(
      rifWalletFactory,
      networkId ? networkId : chainId,
    )(mnemonic)

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
    //set wallets in the store
    thunkAPI.dispatch(
      setWallet({
        wallet: kms.rifWallet,
        walletIsDeployed: {
          loading: false,
          isDeployed: kms.rifWalletIsDeployed,
          txHash: null,
        },
      }),
    )

    // unclock the app
    thunkAPI.dispatch(setUnlocked(true))

    // create fetcher
    //@TODO: refactor socket initialization, it repeats several times
    thunkAPI.dispatch(setChainId(chainId))

    const fetcherInstance = new RifWalletServicesFetcher(
      createPublicAxios(chainId),
      {
        defaultChainId: chainId.toString(),
        resultsLimit: 10,
      },
    )

    const { usdPrices } = thunkAPI.getState()

    // connect to sockets
    rifSockets({
      wallet: kms.rifWallet,
      fetcher: fetcherInstance,
      dispatch: thunkAPI.dispatch,
      setGlobalError: thunkAPI.rejectWithValue,
      usdPrices,
      chainId,
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
    // check if it is a first launch, deleteKeys
    const {
      settings: { isFirstLaunch },
    } = thunkAPI.getState()
    // if previously installed the app, remove stored encryted keys
    if (isFirstLaunch && !__DEV__) {
      await deleteKeys()
      thunkAPI.dispatch(setIsFirstLaunch(false))
      return thunkAPI.rejectWithValue('FIRST LAUNCH, DELETE PREVIOUS KEYS')
    }

    const serializedKeys = await getKeys()
    const { chainId } = thunkAPI.getState().settings
    if (!serializedKeys) {
      return thunkAPI.rejectWithValue('No Existing Keys')
    }

    const pinUnlocked = payload?.pinUnlocked
    const supportedBiometry = await getSupportedBiometryType()

    if (Platform.OS === 'android' && !supportedBiometry && !pinUnlocked) {
      const {
        settings: { pin },
      } = thunkAPI.getState()

      // if there's no pin yet and biometrics removed
      !pin && thunkAPI.dispatch(resetApp())

      setTimeout(() => {
        navigationContainerRef.navigate(rootTabsRouteNames.InitialPinScreen)
      }, 100)
      return thunkAPI.rejectWithValue('Move to unlock with PIN')
    }

    // set wallets in the store
    const existingWallet = await loadExistingWallet(
      createRIFWalletFactory(
        request => thunkAPI.dispatch(onRequest({ request })),
        chainId,
      ),
    )(serializedKeys)

    if (!existingWallet) {
      return thunkAPI.rejectWithValue('No Existing Wallet')
    }

    const { kms, rifWallet, rifWalletIsDeployed } = existingWallet

    thunkAPI.dispatch(
      setWallet({
        wallet: rifWallet,
        walletIsDeployed: {
          loading: false,
          isDeployed: rifWalletIsDeployed,
          txHash: null,
        },
      }),
    )

    thunkAPI.dispatch(setUnlocked(true))

    // create fetcher
    const fetcherInstance = new RifWalletServicesFetcher(
      createPublicAxios(chainId),
      {
        defaultChainId: chainId.toString(),
        resultsLimit: 10,
      },
    )

    const { usdPrices } = thunkAPI.getState()

    // connect to sockets
    rifSockets({
      wallet: rifWallet,
      fetcher: fetcherInstance,
      dispatch: thunkAPI.dispatch,
      setGlobalError: thunkAPI.rejectWithValue,
      usdPrices,
      chainId,
    })

    socketsEvents.emit(SocketsEvents.CONNECT)

    // initialize bitcoin
    const bitcoin = initializeBitcoin(
      kms.mnemonic,
      thunkAPI.dispatch,
      fetcherInstance,
      chainId,
    )

    // set bitcoin in redux
    thunkAPI.dispatch(setBitcoinState(bitcoin))
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
      resetMainStorage()
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
  isFirstLaunch: true,
  isSetup: false,
  topColor: sharedColors.primary,
  requests: [],
  wallets: null,
  walletsIsDeployed: null,
  selectedWallet: '',
  loading: false,
  chainType: ChainTypeEnum.TESTNET,
  appIsActive: false,
  unlocked: false,
  previouslyUnlocked: false,
  fullscreen: false,
  hideBalance: false,
  pin: null,
  bitcoin: null,
  chainId: 31,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setIsFirstLaunch: (state, { payload }: PayloadAction<boolean>) => {
      state.isFirstLaunch = payload
    },
    setIsSetup: (state, { payload }: PayloadAction<boolean>) => {
      state.isSetup = payload
      return state
    },
    changeTopColor: (state, action: PayloadAction<string>) => {
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
      state.chainType =
        payload === 31 ? ChainTypeEnum.TESTNET : ChainTypeEnum.MAINNET
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
    setPinState: (state, { payload }: PayloadAction<string | null>) => {
      state.pin = payload
    },
    setWallet: (
      state,
      { payload: { wallet, walletIsDeployed } }: PayloadAction<SetKeysAction>,
    ) => {
      state.wallets = {
        [wallet.address]: wallet,
      }

      state.walletsIsDeployed = {
        [wallet.address]: walletIsDeployed,
      }
      state.selectedWallet = wallet.address
    },
    setWalletIsDeployed: (
      state,
      { payload }: PayloadAction<SetWalletIsDeployedAction>,
    ) => {
      if (state.walletsIsDeployed) {
        state.walletsIsDeployed[payload.address] = {
          ...state.walletsIsDeployed[payload.address],
          loading: false,
          isDeployed: payload.value ? payload.value : true,
        }
      }
    },
    setSmartWalletDeployTx: (
      state,
      { payload }: PayloadAction<{ address: string; txHash: string }>,
    ) => {
      if (state.walletsIsDeployed) {
        state.walletsIsDeployed[payload.address] = {
          ...state.walletsIsDeployed[payload.address],
          txHash: payload.txHash,
        }
      }
    },
    setIsDeploying: (
      state,
      { payload }: PayloadAction<{ address: string; isDeploying: boolean }>,
    ) => {
      if (state.walletsIsDeployed) {
        state.walletsIsDeployed[payload.address] = {
          ...state.walletsIsDeployed[payload.address],
          loading: payload.isDeploying,
        }
      }
    },
    // Not currently used, we'll be needed when support
    // for multiple wallets
    // switchSelectedWallet: (state, { payload }: PayloadAction<string>) => {
    //   state.selectedWallet = payload
    // },
    removeKeysFromState: state => {
      state.wallets = null
      state.walletsIsDeployed = null
      state.selectedWallet = ''
    },
    resetKeysAndPin: () => {
      deleteKeys()
      deleteDomains()
      deleteCache()
      return initialState
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
  setIsFirstLaunch,
  setIsSetup,
  changeTopColor,
  onRequest,
  closeRequest,
  setWallet,
  setPinState,
  setChainId,
  setAppIsActive,
  setUnlocked,
  setPreviouslyUnlocked,
  setWalletIsDeployed,
  setSmartWalletDeployTx,
  setIsDeploying,
  removeKeysFromState,
  resetKeysAndPin,
  setFullscreen,
  setHideBalance,
  setBitcoinState,
} = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer

export * from './selectors'
