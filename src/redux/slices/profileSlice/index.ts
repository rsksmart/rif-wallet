import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DomainRegistrationEnum } from 'lib/rns'

import { ProfileStatus } from 'navigation/profileNavigator/types'
import { Wallet } from 'shared/wallet'
import { AppDispatch, AsyncThunkWithTypes } from 'store/store'
import {
  OnSetTransactionStatusChange,
  TransactionStatus,
} from 'store/shared/types'
import { abiEnhancer } from 'core/setup'
import { handleTransactionStatusChange } from 'store/shared/utils'
import { delay } from 'shared/utils'

import {
  CommitmentRnsProcess,
  DeleteRnsProcess,
  ProfileStore,
  PurchaseUsername,
  RequestUsername,
} from './types'

export const handleDomainTransactionStatusChange =
  (dispatch: AppDispatch, wallet: Wallet) =>
  async (tx: Parameters<OnSetTransactionStatusChange>[0]) => {
    const txTransformed = tx
    if (txTransformed.txStatus === TransactionStatus.PENDING) {
      const chainId = await wallet.getChainId()
      // decode transaction
      const enhancedTransaction = await abiEnhancer.enhance(chainId, {
        data: txTransformed.data,
      })
      if (enhancedTransaction) {
        // transform it
        txTransformed.symbol = enhancedTransaction.symbol
        txTransformed.enhancedAmount = enhancedTransaction.value?.toString()
      }
    }
    // pass it to redux
    handleTransactionStatusChange(dispatch)(txTransformed)
  }

export const requestUsername = createAsyncThunk<
  unknown,
  RequestUsername,
  AsyncThunkWithTypes
>(
  'profile/requestUsername',
  async ({ alias, duration, getRnsProcessor }, thunkAPI) => {
    try {
      const rnsProcessor = getRnsProcessor()

      if (!rnsProcessor) {
        return thunkAPI.rejectWithValue('No RNS Processor created')
      }

      thunkAPI.dispatch(setAlias(`${alias}.rsk`))
      thunkAPI.dispatch(setDuration(duration))

      let indexStatus = rnsProcessor.getStatus(alias)

      if (!indexStatus?.commitmentRequested) {
        thunkAPI.dispatch(setStatus(ProfileStatus.WAITING_FOR_USER_COMMIT))
        await rnsProcessor.process(alias, duration)
        thunkAPI.dispatch(setStatus(ProfileStatus.REQUESTING))
      }

      indexStatus = rnsProcessor.getStatus(alias)

      if (indexStatus.commitmentRequested) {
        return await thunkAPI.dispatch(commitment({ alias, getRnsProcessor }))
      }

      return null
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)

export const purchaseUsername = createAsyncThunk(
  'profile/purchaseUsername',
  async ({ domain, getRnsProcessor }: PurchaseUsername, thunkAPI) => {
    try {
      const rnsProcessor = getRnsProcessor()

      if (!rnsProcessor) {
        return thunkAPI.rejectWithValue('No RNS Processor created')
      }

      return await rnsProcessor.register(domain)
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  },
)

export const deleteRnsProcess = createAsyncThunk(
  'profile/deleteRnsProcess',
  async ({ getRnsProcessor, domain }: DeleteRnsProcess, thunkAPI) => {
    try {
      const rnsProcessor = getRnsProcessor()

      if (!rnsProcessor) {
        return thunkAPI.rejectWithValue('No RNS Processor created')
      }

      rnsProcessor.deleteRnsProcess(domain)
      thunkAPI.dispatch(deleteProfile())

      return true
    } catch (err) {
      thunkAPI.rejectWithValue(err)
      return false
    }
  },
)

export const commitment = createAsyncThunk<
  DomainRegistrationEnum.COMMITMENT_READY,
  CommitmentRnsProcess,
  AsyncThunkWithTypes
>('profile/commitment', async ({ alias, getRnsProcessor }, thunkAPI) => {
  try {
    const rnsProcessor = getRnsProcessor()

    if (!rnsProcessor) {
      return thunkAPI.rejectWithValue('No RNS Processor created')
    }

    let response = await rnsProcessor.canReveal(alias)

    while (response !== DomainRegistrationEnum.COMMITMENT_READY) {
      await delay(3000)
      response = await rnsProcessor.canReveal(alias)
    }

    thunkAPI.dispatch(setStatus(ProfileStatus.READY_TO_PURCHASE))

    return DomainRegistrationEnum.COMMITMENT_READY
  } catch (err) {
    return thunkAPI.dispatch(err)
  }
})

const initialState: ProfileStore = {
  alias: '',
  phone: '',
  email: '',
  status: ProfileStatus.NONE,
  infoBoxClosed: false,
  duration: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (_, action: PayloadAction<ProfileStore>) => action.payload,
    setEmail: (state, { payload }: PayloadAction<string>) => {
      state.email = payload
    },
    setPhone: (state, { payload }: PayloadAction<string>) => {
      state.phone = payload
    },
    setInfoBoxClosed: (state, { payload }: PayloadAction<boolean>) => {
      state.infoBoxClosed = payload
    },
    setAlias: (state, { payload }: PayloadAction<string>) => {
      state.alias = payload
    },
    setStatus: (state, { payload }: PayloadAction<ProfileStatus>) => {
      state.status = payload
    },
    recoverAlias: (
      state,
      { payload }: PayloadAction<Partial<ProfileStore>>,
    ) => {
      state.alias = payload.alias || ''
      state.status = payload.status || ProfileStatus.NONE
    },
    setDuration: (state, { payload }: PayloadAction<number>) => {
      state.duration = payload
    },
    deleteProfile: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(requestUsername.fulfilled, state => {
      state.status = ProfileStatus.READY_TO_PURCHASE
    })
    builder.addCase(requestUsername.pending, state => {
      state.status = ProfileStatus.REQUESTING
    })
    builder.addCase(requestUsername.rejected, state => {
      state.status = ProfileStatus.NONE
    })
    builder.addCase(purchaseUsername.fulfilled, state => {
      state.status = ProfileStatus.USER
    })
    builder.addCase(purchaseUsername.pending, state => {
      state.status = ProfileStatus.PURCHASING
    })
    builder.addCase(purchaseUsername.rejected, state => {
      state.status = ProfileStatus.READY_TO_PURCHASE
    })
  },
})

export const {
  setProfile,
  setEmail,
  setPhone,
  setInfoBoxClosed,
  setStatus,
  setAlias,
  deleteProfile,
  recoverAlias,
  setDuration,
} = profileSlice.actions

export const profileReducer = profileSlice.reducer

export * from './selector'
export * from './types'
