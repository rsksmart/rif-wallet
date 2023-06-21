import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getSupportedBiometryType } from 'react-native-keychain'
import { Platform } from 'react-native'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import Keychain from 'react-native-keychain'
import {
  RifWalletServicesAuth,
  RifWalletServicesFetcher,
} from '@rsksmart/rif-wallet-services'

import { KeyManagementSystem } from 'lib/core'

import {
  addNextWallet,
  createKMS,
  deleteCache,
  loadExistingWallets,
} from 'core/operations'
import { deleteDomains } from 'storage/DomainsStore'
import { deleteContacts as deleteContactsFromRedux } from 'store/slices/contactsSlice'
import { deletePin, resetMainStorage } from 'storage/MainStorage'
import { deleteKeys, getKeys } from 'storage/SecureStorage'
import { sharedColors } from 'shared/constants'
import { createRIFWalletFactory } from 'core/setup'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { deleteProfile } from 'store/slices/profileSlice'
import { navigationContainerRef } from 'src/core/Core'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { createKeysRouteNames } from 'navigation/createKeysNavigator'
import { AsyncThunkWithTypes } from 'store/store'
import { WalletsIsDeployed } from 'src/Context'
import {
  rifSockets,
  SocketsEvents,
  socketsEvents,
} from 'src/subscriptions/rifSockets'
import { authAxios, createPublicAxios, authClient } from 'core/setup'
import {
  deleteSignUp,
  getSignUP,
  hasSignUP,
  saveSignUp,
} from 'storage/MainStorage'
import { initializeBitcoin } from 'src/core/hooks/bitcoin/initializeBitcoin'
import { ChainTypesByIdType } from 'shared/constants/chainConstants'

import {
  AddNewWalletAction,
  Bitcoin,
  ChainTypeEnum,
  CreateFirstWalletAction,
  OnRequestAction,
  SetKeysAction,
  SetNewWalletAction,
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
    const { rifWallet, rifWalletsDictionary, rifWalletsIsDeployedDictionary } =
      await createKMS(
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
            backScreen: rootTabsRouteNames.Home,
          },
        })
      }, 100)
    }
    const walletsIsDeployed: WalletsIsDeployed = {}

    for (const key in rifWalletsIsDeployedDictionary) {
      walletsIsDeployed[key] = {
        loading: false,
        isDeployed: rifWalletsIsDeployedDictionary[key],
        txHash: null,
      }
    }

    //set wallets in the store
    thunkAPI.dispatch(
      setWallets({
        wallets: rifWalletsDictionary,
        walletsIsDeployed: walletsIsDeployed,
      }),
    )

    // unclock the app
    thunkAPI.dispatch(setUnlocked(true))

    // create fetcher
    const currentWallet =
      rifWalletsDictionary[Object.keys(rifWalletsDictionary)[0]]

    thunkAPI.dispatch(setChainId(chainId))

    const rifWalletAuth = new RifWalletServicesAuth<
      Keychain.Options,
      ReturnType<typeof Keychain.setInternetCredentials>,
      ReturnType<typeof Keychain.resetInternetCredentials>
    >(createPublicAxios(chainId), currentWallet, {
      authClient,
      onGetSignUp: getSignUP,
      onHasSignUp: hasSignUP,
      onDeleteSignUp: deleteSignUp,
      onSaveSignUp: saveSignUp,
      onSetInternetCredentials: Keychain.setInternetCredentials,
      onResetInternetCredentials: Keychain.resetInternetCredentials,
    })

    const { accessToken, refreshToken } = await rifWalletAuth.login()

    const fetcherInstance = new RifWalletServicesFetcher<
      Keychain.Options,
      ReturnType<typeof Keychain.setInternetCredentials>
    >(authAxios, accessToken, refreshToken, {
      defaultChainId: chainId.toString(),
      onSetInternetCredentials: Keychain.setInternetCredentials,
      resultsLimit: 10,
    })

    const { usdPrices } = thunkAPI.getState()

    // connect to sockets
    rifSockets({
      wallet: currentWallet,
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

    return rifWallet
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
    const supportedBiometry = await getSupportedBiometryType()
    const serializedKeys = await getKeys()
    const { chainId } = thunkAPI.getState().settings
    if (!serializedKeys) {
      return thunkAPI.rejectWithValue('No Existing Keys')
    }

    const pinUnlocked = payload?.pinUnlocked

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
    const existingWallets = await loadExistingWallets(
      createRIFWalletFactory(
        request => thunkAPI.dispatch(onRequest({ request })),
        chainId,
      ),
    )(serializedKeys)

    const { kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary } =
      existingWallets

    const walletsIsDeployed: WalletsIsDeployed = {}

    for (const key in rifWalletsIsDeployedDictionary) {
      walletsIsDeployed[key] = {
        loading: false,
        isDeployed: rifWalletsIsDeployedDictionary[key],
        txHash: null,
      }
    }

    thunkAPI.dispatch(
      setWallets({
        wallets: rifWalletsDictionary,
        walletsIsDeployed,
      }),
    )

    thunkAPI.dispatch(setUnlocked(true))

    const currentWallet =
      rifWalletsDictionary[Object.keys(rifWalletsDictionary)[0]]

    // create fetcher
    const rifWalletAuth = new RifWalletServicesAuth<
      Keychain.Options,
      ReturnType<typeof Keychain.setInternetCredentials>,
      ReturnType<typeof Keychain.resetInternetCredentials>
    >(createPublicAxios(chainId), currentWallet, {
      authClient,
      onGetSignUp: getSignUP,
      onHasSignUp: hasSignUP,
      onDeleteSignUp: deleteSignUp,
      onSaveSignUp: saveSignUp,
      onSetInternetCredentials: Keychain.setInternetCredentials,
      onResetInternetCredentials: Keychain.resetInternetCredentials,
    })

    const { accessToken, refreshToken } = await rifWalletAuth.login()

    const fetcherInstance = new RifWalletServicesFetcher<
      Keychain.Options,
      ReturnType<typeof Keychain.setInternetCredentials>
    >(authAxios, accessToken, refreshToken, {
      defaultChainId: chainId.toString(),
      onSetInternetCredentials: Keychain.setInternetCredentials,
      resultsLimit: 10,
    })

    const { usdPrices } = thunkAPI.getState()

    // connect to sockets
    rifSockets({
      wallet: currentWallet,
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
      thunkAPI.dispatch(setPinState(''))
      resetMainStorage()
      return 'deleted'
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)

export const addNewWallet = createAsyncThunk(
  'settings/addNewWallet',
  async ({ networkId }: AddNewWalletAction, thunkAPI) => {
    try {
      const keys = await getKeys()
      const { chainId } = thunkAPI.getState().settings
      if (!keys) {
        return thunkAPI.rejectWithValue(
          'Can not add new wallet because no KMS created.',
        )
      }
      const { kms } = KeyManagementSystem.fromSerialized(keys)
      const { rifWallet, isDeloyed } = await addNextWallet(
        kms,
        createRIFWalletFactory(
          request => thunkAPI.dispatch(onRequest({ request })),
          chainId,
        ),
        networkId,
      )
      thunkAPI.dispatch(setNewWallet({ rifWallet, isDeployed: isDeloyed }))
      return {
        rifWallet,
        isDeloyed,
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)

const initialState: SettingsSlice = {
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
  previouslyUnlocked: true,
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
    setIsSetup: (state, { payload }: { payload: boolean }) => {
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
    setPinState: (state, { payload }: PayloadAction<string>) => {
      state.pin = payload
    },
    setWallets: (state, { payload }: PayloadAction<SetKeysAction>) => {
      state.wallets = payload.wallets
      state.walletsIsDeployed = payload.walletsIsDeployed
      state.selectedWallet = state.wallets
        ? state.wallets[Object.keys(state.wallets)[0]].address
        : ''
    },
    setNewWallet: (state, { payload }: PayloadAction<SetNewWalletAction>) => {
      state.wallets = {
        ...state.wallets,
        [payload.rifWallet.address]: payload.rifWallet,
        walletsIsDeployed: {
          ...state.walletsIsDeployed,
          [payload.rifWallet.address]: payload.isDeployed,
        },
      }
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
          ...state.walletsIsDeployed?.[payload.address],
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
          ...state.walletsIsDeployed?.[payload.address],
          loading: payload.isDeploying,
        }
      }
    },
    switchSelectedWallet: (state, { payload }: PayloadAction<string>) => {
      state.selectedWallet = payload
    },
    removeKeysFromState: state => {
      state.wallets = null
      state.walletsIsDeployed = null
      state.selectedWallet = ''
    },
    resetKeysAndPin: () => {
      deleteKeys()
      deletePin()
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
    builder.addCase(addNewWallet.pending, state => {
      state.loading = true
    })
    builder.addCase(addNewWallet.rejected, state => {
      state.loading = false
    })
    builder.addCase(addNewWallet.fulfilled, state => {
      state.loading = false
    })
  },
})

export const {
  setIsSetup,
  changeTopColor,
  onRequest,
  closeRequest,
  setWallets,
  setPinState,
  setNewWallet,
  setChainId,
  setAppIsActive,
  setUnlocked,
  setPreviouslyUnlocked,
  setWalletIsDeployed,
  setSmartWalletDeployTx,
  setIsDeploying,
  removeKeysFromState,
  resetKeysAndPin,
  switchSelectedWallet,
  setFullscreen,
  setHideBalance,
  setBitcoinState,
} = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer

export * from './selectors'
