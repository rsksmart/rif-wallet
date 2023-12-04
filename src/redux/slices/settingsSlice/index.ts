import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSupportedBiometryType } from 'react-native-keychain'
import { ColorValue, Platform } from 'react-native'
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { RifWalletServicesFetcher } from '@rsksmart/rif-wallet-services'
import { providers } from 'ethers'

import { EOAWallet } from 'lib/eoaWallet'

import { deleteCache } from 'core/operations'
import { deleteDomains } from 'storage/DomainsStore'
import { deleteContacts as deleteContactsFromRedux } from 'store/slices/contactsSlice'
import { resetMainStorage } from 'storage/MainStorage'
import { deleteKeys, getKeys, saveKeys } from 'storage/SecureStorage'
import { sharedColors } from 'shared/constants'
import { createPublicAxios } from 'core/setup'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { deleteProfile } from 'store/slices/profileSlice'
import { navigationContainerRef } from 'core/Core'
import { initializeBitcoin } from 'core/hooks/bitcoin/initializeBitcoin'
import { getWalletSetting } from 'core/config'
import { SETTINGS } from 'core/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { createKeysRouteNames } from 'navigation/createKeysNavigator'
import { AsyncThunkWithTypes } from 'store/store'
import {
  rifSockets,
  SocketsEvents,
  socketsEvents,
} from 'src/subscriptions/rifSockets'
import {
  chainTypesById,
  ChainTypesByIdType,
} from 'shared/constants/chainConstants'
import { getCurrentChainId } from 'storage/ChainStorage'
import { resetReduxStorage } from 'storage/ReduxStorage'
import {
  setIsFirstLaunch,
  setKeysExist,
  setPinState,
} from 'store/slices/persistentDataSlice'
import { Wallet } from 'shared/wallet'

import {
  Bitcoin,
  CreateFirstWalletAction,
  OnRequestAction,
  SettingsSlice,
  UnlockAppAction,
} from './types'

const sslPinning = async (chainId: ChainTypesByIdType) => {
  const rifWalletServiceDomain = getWalletSetting(
    SETTINGS.RIF_WALLET_SERVICE_URL,
    chainTypesById[chainId],
  ).split('//')[1]

  const rifWalletServicePk = getWalletSetting(
    SETTINGS.RIF_WALLET_SERVICE_PUBLIC_KEY,
    chainTypesById[chainId],
  ).split(',')
  console.log('rifWalletServicePk', rifWalletServicePk)
  const rifRelayDomain = getWalletSetting(
    SETTINGS.RIF_RELAY_SERVER,
    chainTypesById[chainId],
  ).split('//')[1]

  const rifRelayPk = getWalletSetting(
    SETTINGS.RIF_RELAY_SERVER_PK,
    chainTypesById[chainId],
  ).split(',')

  await initializeSslPinning({
    [rifWalletServiceDomain]: {
      includeSubdomains: true,
      publicKeyHashes: rifWalletServicePk,
    },
    [rifRelayDomain]: {
      includeSubdomains: true,
      publicKeyHashes: rifRelayPk,
    },
  })
}

export const createWallet = createAsyncThunk<
  RIFWallet,
  CreateFirstWalletAction,
  AsyncThunkWithTypes
>('settings/createWallet', async ({ mnemonic, initializeWallet }, thunkAPI) => {
  try {
    const { chainId } = thunkAPI.getState().settings

    const url = getWalletSetting(SETTINGS.RPC_URL, chainTypesById[chainId])
    const jsonRpcProvider = new providers.StaticJsonRpcProvider(url)

    const wallet = EOAWallet.create(
      mnemonic,
      chainId,
      jsonRpcProvider,
      request => thunkAPI.dispatch(onRequest({ request })),
      saveKeys,
    )

    const supportedBiometry = await getSupportedBiometryType()

    if (Platform.OS === 'android' && !supportedBiometry) {
      setTimeout(() => {
        navigationContainerRef.navigate(rootTabsRouteNames.CreateKeysUX, {
          screen: createKeysRouteNames.PinScreen,
          params: {
            isChangeRequested: true,
            backScreen: null,
          },
        })
      }, 100)
    }

    if (!wallet) {
      return thunkAPI.rejectWithValue('Failed to create a Wallet')
    }

    // set wallet and walletIsDeployed in WalletContext
    initializeWallet(wallet, {
      isDeployed: true,
      loading: false,
      txHash: null,
    })

    // unclock the app
    if (supportedBiometry || (Platform.OS === 'ios' && __DEV__)) {
      thunkAPI.dispatch(setUnlocked(true))
    }
    // set keysExist
    thunkAPI.dispatch(setKeysExist(true))

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

    const { usdPrices, balances } = thunkAPI.getState()

    await sslPinning(chainId)

    // connect to sockets
    rifSockets({
      address: wallet.address,
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

    return wallet
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
})

export const unlockApp = createAsyncThunk<
  void,
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

    let keys = await getKeys()
    let wallet: Wallet | null = null

    if (!keys) {
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
          navigationContainerRef.navigate(rootTabsRouteNames.CreateKeysUX, {
            screen: createKeysRouteNames.PinScreen,
            params: {
              isChangeRequested: false,
            },
          })
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
    // this is for old wallet created using KMS
    // @TODO: remove if in the future
    if (keys.state) {
      const url = getWalletSetting(SETTINGS.RPC_URL, chainTypesById[chainId])
      const jsonRpcProvider = new providers.StaticJsonRpcProvider(url)

      wallet = EOAWallet.create(
        keys.mnemonic!,
        chainId,
        jsonRpcProvider,
        request => thunkAPI.dispatch(onRequest({ request })),
        saveKeys,
      )

      keys = await getKeys()
    }

    const { privateKey, mnemonic } = keys!

    const url = getWalletSetting(SETTINGS.RPC_URL, chainTypesById[chainId])
    const jsonRpcProvider = new providers.StaticJsonRpcProvider(url)

    //@TODO: remove if in the future
    if (!keys?.state) {
      wallet = EOAWallet.fromPrivateKey(privateKey, jsonRpcProvider, request =>
        thunkAPI.dispatch(onRequest({ request })),
      )
    }

    if (!wallet) {
      return thunkAPI.rejectWithValue('No Existing Wallet')
    }

    // const { kms, rifWallet, rifWalletIsDeployed } = existingWallet

    // set wallet and walletIsDeployed in WalletContext
    initializeWallet(wallet, {
      isDeployed: true,
      loading: false,
      txHash: null,
    })

    thunkAPI.dispatch(setUnlocked(true))

    // create fetcher
    const fetcherInstance = new RifWalletServicesFetcher(
      createPublicAxios(chainId),
      {
        defaultChainId: chainId.toString(),
        resultsLimit: 10,
      },
    )

    const { usdPrices, balances } = thunkAPI.getState()

    await sslPinning(chainId)

    // connect to sockets
    rifSockets({
      address: wallet.address,
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
      mnemonic ?? privateKey,
      thunkAPI.dispatch,
      fetcherInstance,
      chainId,
    )

    // set bitcoin in redux
    thunkAPI.dispatch(setBitcoinState(bitcoin))
    return keys
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
      console.log('SETTING UNCLOKED TO TRUE')
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
