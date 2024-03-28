import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSupportedBiometryType } from 'react-native-keychain'
import { ColorValue, Platform } from 'react-native'
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning'
import { RifWalletServicesFetcher } from '@rsksmart/rif-wallet-services'
import { providers } from 'ethers'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'
import Config from 'react-native-config'

import { ChainID, WalletState } from 'lib/eoaWallet'

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
import { AppDispatch, AsyncThunkWithTypes } from 'store/store'
import {
  rifSockets,
  SocketsEvents,
  socketsEvents,
} from 'src/subscriptions/rifSockets'
import { getCurrentChainId } from 'storage/ChainStorage'
import { resetReduxStorage } from 'storage/ReduxStorage'
import {
  setIsFirstLaunch,
  setKeysExist,
  setPinState,
} from 'store/slices/persistentDataSlice'
import { addressToUse, Wallet } from 'shared/wallet'
import { createAppWallet, loadAppWallet } from 'shared/utils'
import { MMKVStorage } from 'storage/MMKVStorage'
import { deleteWCSessions } from 'screens/walletConnect/walletConnect2.utils'

import {
  Bitcoin,
  CreateFirstWalletAction,
  OnRequestAction,
  SettingsSlice,
  UnlockAppAction,
} from './types'
import { UsdPricesState } from '../usdPricesSlice'
import { BalanceState } from '../balancesSlice/types'

export const deleteCache = () => {
  const cache = new MMKVStorage('txs')
  cache.deleteAll()
}

export const getRifRelayConfig = (chainId: 30 | 31): RifRelayConfig => {
  return {
    smartWalletFactoryAddress: getWalletSetting(
      SETTINGS.SMART_WALLET_FACTORY_ADDRESS,
      chainId,
    ),
    relayVerifierAddress: getWalletSetting(
      SETTINGS.RELAY_VERIFIER_ADDRESS,
      chainId,
    ),
    deployVerifierAddress: getWalletSetting(
      SETTINGS.DEPLOY_VERIFIER_ADDRESS,
      chainId,
    ),
    relayServer: getWalletSetting(SETTINGS.RIF_RELAY_SERVER, chainId),
  }
}

const sslPinning = async (chainId: ChainID) => {
  const rifWalletServiceDomain = getWalletSetting(
    SETTINGS.RIF_WALLET_SERVICE_URL,
    chainId,
  ).split('//')[1]

  const rifWalletServicePk = getWalletSetting(
    SETTINGS.RIF_WALLET_SERVICE_PUBLIC_KEY,
    chainId,
  ).split(',')
  const rifRelayDomain = getWalletSetting(
    SETTINGS.RIF_RELAY_SERVER,
    chainId,
  ).split('//')[1]

  const rifRelayPk = getWalletSetting(
    SETTINGS.RIF_RELAY_SERVER_PK,
    chainId,
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

const initializeApp = async (
  mnemonic: string,
  wallet: Wallet,
  chainId: ChainID,
  usdPrices: UsdPricesState,
  balances: BalanceState,
  dispatch: AppDispatch,
  rejectWithValue: (err: string) => void,
) => {
  const fetcherInstance = new RifWalletServicesFetcher(
    createPublicAxios(chainId),
    {
      defaultChainId: chainId.toString(),
      resultsLimit: 10,
    },
  )

  await sslPinning(chainId)

  // connect to sockets
  rifSockets({
    address: addressToUse(wallet),
    dispatch,
    setGlobalError: rejectWithValue,
    usdPrices,
    chainId,
    balances: balances.tokenBalances,
  })

  socketsEvents.emit(SocketsEvents.CONNECT)

  // initialize bitcoin
  const bitcoin = initializeBitcoin(
    mnemonic,
    dispatch,
    fetcherInstance,
    chainId,
  )

  // set bitcoin in redux
  dispatch(setBitcoinState(bitcoin))
}

export const createWallet = createAsyncThunk<
  Wallet,
  CreateFirstWalletAction,
  AsyncThunkWithTypes
>('settings/createWallet', async ({ mnemonic, initializeWallet }, thunkAPI) => {
  try {
    const { chainId } = thunkAPI.getState().settings

    const url = getWalletSetting(SETTINGS.RPC_URL, chainId)
    const jsonRpcProvider = new providers.StaticJsonRpcProvider(url)

    const wallet = await createAppWallet(
      mnemonic,
      chainId,
      jsonRpcProvider,
      request => thunkAPI.dispatch(onRequest({ request })),
      getRifRelayConfig(chainId),
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
      isDeployed: await wallet.isDeployed,
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

    const { usdPrices, balances } = thunkAPI.getState()

    await initializeApp(
      mnemonic,
      wallet,
      chainId,
      usdPrices,
      balances,
      thunkAPI.dispatch,
      thunkAPI.rejectWithValue,
    )

    return wallet
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
})

export const unlockApp = createAsyncThunk<
  WalletState,
  UnlockAppAction,
  AsyncThunkWithTypes
>('settings/unlockApp', async (payload, thunkAPI) => {
  try {
    if (!Config.TRACE_ID) {
      const { setGlobalError } = payload
      const errorMessage = 'global_trace_id_error'
      setGlobalError(errorMessage)
      return thunkAPI.rejectWithValue(errorMessage)
    }

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

    const keys = await getKeys()

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

    const url = getWalletSetting(SETTINGS.RPC_URL, chainId)
    const jsonRpcProvider = new providers.StaticJsonRpcProvider(url)

    const wallet = await loadAppWallet(
      keys,
      chainId,
      jsonRpcProvider,
      request => thunkAPI.dispatch(onRequest({ request })),
      getRifRelayConfig(chainId),
    )

    if (!wallet) {
      return thunkAPI.rejectWithValue('No Existing Wallet')
    }

    // set wallet and walletIsDeployed in WalletContext
    initializeWallet(wallet, {
      isDeployed: await wallet.isDeployed,
      loading: false,
      txHash: null,
    })

    thunkAPI.dispatch(setUnlocked(true))

    const { usdPrices, balances } = thunkAPI.getState()

    await initializeApp(
      keys.mnemonic ?? keys.privateKey,
      wallet,
      chainId,
      usdPrices,
      balances,
      thunkAPI.dispatch,
      thunkAPI.rejectWithValue,
    )

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
      deleteWCSessions()
      return 'deleted'
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)

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
    setChainId: (state, { payload }: PayloadAction<ChainID>) => {
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
