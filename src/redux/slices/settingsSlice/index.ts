import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getChainIdByType } from 'lib/utils'
import { KeyManagementSystem } from 'lib/core'

import {
  addNextWallet,
  createKMS,
  deleteCache,
  loadExistingWallets,
} from 'core/operations'
import { deleteDomains } from 'storage/DomainsStore'
import { deleteContacts as deleteContactsFromRedux } from 'store/slices/contactsSlice'
import { deletePin, resetMainStorage, savePin } from 'storage/MainStorage'
import { deleteKeys, getKeys } from 'storage/SecureStorage'
import { colors } from 'src/styles'
import {
  createRIFWalletFactory,
  networkType as defaultNetworkType,
} from 'core/setup'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { deleteProfile } from 'store/slices/profileSlice'

import {
  AddNewWalletAction,
  ChainTypeEnum,
  CreateFirstWalletAction,
  OnRequestAction,
  SetKeysAction,
  SetNewWalletAction,
  SettingsSlice,
  SetWalletIsDeployedAction,
} from './types'

export const createWallet = createAsyncThunk(
  'settings/createWallet',
  async ({ mnemonic, networkId }: CreateFirstWalletAction, thunkAPI) => {
    const rifWalletFactory = createRIFWalletFactory(request =>
      thunkAPI.dispatch(onRequest({ request })),
    )
    const { rifWallet, rifWalletsDictionary, rifWalletsIsDeployedDictionary } =
      await createKMS(
        rifWalletFactory,
        networkId ? networkId : getChainIdByType(defaultNetworkType),
      )(mnemonic)

    thunkAPI.dispatch(
      setWallets({
        wallets: rifWalletsDictionary,
        walletsIsDeployed: rifWalletsIsDeployedDictionary,
      }),
    )
    thunkAPI.dispatch(setUnlocked(true))
    return rifWallet
  },
)

export const unlockApp = createAsyncThunk(
  'settings/unlockApp',
  async (_, thunkAPI) => {
    try {
      const existingWallets = await loadExistingWallets(
        createRIFWalletFactory(request =>
          thunkAPI.dispatch(onRequest({ request })),
        ),
      )()

      if (!existingWallets) {
        return thunkAPI.rejectWithValue('No Existing wallets')
      }

      const { kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary } =
        existingWallets

      thunkAPI.dispatch(
        setWallets({
          wallets: rifWalletsDictionary,
          walletsIsDeployed: rifWalletsIsDeployedDictionary,
        }),
      )

      thunkAPI.dispatch(setUnlocked(true))

      return kms
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)

export const resetApp = createAsyncThunk(
  'settings/resetApp',
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(deleteContactsFromRedux())
      thunkAPI.dispatch(resetKeysAndPin())
      thunkAPI.dispatch(resetSocketState())
      thunkAPI.dispatch(deleteProfile())
      thunkAPI.dispatch(setPreviouslyUnlocked(false))
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

      if (!keys) {
        return thunkAPI.rejectWithValue(
          'Can not add new wallet because no KMS created.',
        )
      }
      const { kms } = KeyManagementSystem.fromSerialized(keys)
      const { rifWallet, isDeloyed } = await addNextWallet(
        kms,
        createRIFWalletFactory(request =>
          thunkAPI.dispatch(onRequest({ request })),
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
  topColor: colors.darkPurple3,
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
      state.requests = [payload.request]
    },
    closeRequest: state => {
      state.requests = []
    },
    setChainId: (state, { payload }: PayloadAction<number>) => {
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
    setPinState: (_, { payload }: PayloadAction<string>) => {
      savePin(payload)
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
      state.walletsIsDeployed = {
        ...state.walletsIsDeployed,
        [payload.address]: payload.value ? payload.value : true,
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
  removeKeysFromState,
  resetKeysAndPin,
  switchSelectedWallet,
  setFullscreen,
} = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer

export * from './selectors'
