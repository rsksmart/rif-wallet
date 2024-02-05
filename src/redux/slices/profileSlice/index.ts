import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DomainRegistrationEnum, RnsProcessor } from 'lib/rns'

import { ProfileStatus } from 'navigation/profileNavigator/types'
import { Wallet } from 'shared/wallet'
import { AppDispatch } from 'store/store'
import {
  OnSetTransactionStatusChange,
  TransactionStatus,
} from 'store/shared/types'
import { abiEnhancer } from 'core/setup'
import { handleTransactionStatusChange } from 'store/shared/utils'

import {
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

export const requestUsername = createAsyncThunk(
  'profile/requestUsername',
  async ({ alias, duration, getRnsProcessor }: RequestUsername, thunkAPI) => {
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
        return await commitment(
          rnsProcessor,
          alias,
          IntervalProcessOrigin.RNS_ORIGINAL_TRANSACTION,
        )
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

export enum IntervalProcessOrigin {
  NONE = 'NONE',
  RNS_ORIGINAL_TRANSACTION = 'RNS_ORIGINAL_TRANSACTION',
  PROFILE_CREATE_EFFECT = 'PROFILE_CREATE_EFFECT',
}
const commitmentIntervalProcess: {
  interval?: ReturnType<typeof setInterval>
  intervalOrigin: IntervalProcessOrigin
} = {
  intervalOrigin: IntervalProcessOrigin.NONE,
}

export const commitment = (
  rnsProcessor: RnsProcessor,
  alias: string,
  intervalProcessOrigin: IntervalProcessOrigin,
): Promise<ProfileStatus> => {
  return new Promise((resolve, reject) => {
    if (commitmentIntervalProcess.interval) {
      reject('Interval is already running.')
    }
    commitmentIntervalProcess.intervalOrigin = intervalProcessOrigin
    commitmentIntervalProcess.interval = setInterval(() => {
      rnsProcessor
        .canReveal(
          alias,
          intervalProcessOrigin ===
            IntervalProcessOrigin.RNS_ORIGINAL_TRANSACTION,
        )
        .then(canRevealResponse => {
          if (canRevealResponse === DomainRegistrationEnum.COMMITMENT_READY) {
            clearInterval(commitmentIntervalProcess.interval)
            commitmentIntervalProcess.interval = undefined
            commitmentIntervalProcess.intervalOrigin =
              IntervalProcessOrigin.NONE
            resolve(ProfileStatus.READY_TO_PURCHASE)
          }
        })
    }, 1000)
  })
}

export const {
  setProfile,
  setStatus,
  setAlias,
  deleteProfile,
  recoverAlias,
  setDuration,
} = profileSlice.actions

export const profileReducer = profileSlice.reducer

export * from './selector'
export * from './types'
