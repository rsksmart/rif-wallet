import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  addNextWallet,
  createKMS,
  deleteCache,
  loadExistingWallets,
} from 'core/operations'
import { deleteDomains } from 'storage/DomainsStore'
import {
  deleteContacts,
  deleteKeys,
  deletePin,
  savePin,
} from 'storage/MainStorage'
import { colors } from 'src/styles'
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
import {
  createRIFWalletFactory,
  networkType as defaultNetworkType,
} from 'core/setup'
import { getChainIdByType } from 'lib/utils'
// import { createAppAsyncThunk } from 'store/storeUtils'

export const createWallet = createAsyncThunk(
  'settings/createWallet',
  async ({ mnemonic, networkId }: CreateFirstWalletAction, thunkAPI) => {
    const rifWalletFactory = createRIFWalletFactory(request =>
      thunkAPI.dispatch(onRequest({ request })),
    )
    const {
      kms,
      rifWallet,
      rifWalletsDictionary,
      rifWalletsIsDeployedDictionary,
    } = await createKMS(
      rifWalletFactory,
      networkId ? networkId : getChainIdByType(defaultNetworkType),
    )(mnemonic)

    thunkAPI.dispatch(
      setKeysState({
        kms,
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
      const { kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary } =
        await loadExistingWallets(
          createRIFWalletFactory(request =>
            thunkAPI.dispatch(onRequest({ request })),
          ),
        )()

      thunkAPI.dispatch(
        setKeysState({
          kms,
          wallets: rifWalletsDictionary,
          walletsIsDeployed: rifWalletsIsDeployedDictionary,
        }),
      )

      thunkAPI.dispatch(setUnlocked(true))
    } catch (err) {
      thunkAPI.rejectWithValue(err)
    }
  },
)

export const addNewWallet = createAsyncThunk(
  'settings/addNewWallet',
  async ({ networkId }: AddNewWalletAction, thunkAPI) => {
    try {
      const { settings } = thunkAPI.getState()
      if (!settings.kms) {
        return thunkAPI.rejectWithValue(
          'Can not add new wallet because no KMS created.',
        )
      }
      const { rifWallet, isDeloyed } = await addNextWallet(
        settings.kms,
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
  topColor: colors.darkPurple3,
  requests: [],
  kms: null,
  wallets: null,
  walletsIsDeployed: null,
  selectedWallet: '',
  loading: false,
  chainType: ChainTypeEnum.TESTNET,
  appIsActive: false,
  unlocked: false,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
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
    setPinState: (_, { payload }: PayloadAction<string>) => {
      savePin(payload)
    },
    setKeysState: (state, { payload }: PayloadAction<SetKeysAction>) => {
      state.kms = payload.kms
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
      state.kms = null
      state.wallets = null
      state.walletsIsDeployed = null
      state.selectedWallet = ''
    },
    resetKeysAndPin: () => {
      deleteKeys()
      deletePin()
      deleteContacts()
      deleteDomains()
      deleteCache()
      return initialState
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
  changeTopColor,
  onRequest,
  closeRequest,
  setKeysState,
  setPinState,
  setNewWallet,
  setChainId,
  setAppIsActive,
  setUnlocked,
  setWalletIsDeployed,
  removeKeysFromState,
  resetKeysAndPin,
  switchSelectedWallet,
} = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer

export * from './selectors'
