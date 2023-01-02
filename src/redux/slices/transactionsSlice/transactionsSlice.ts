import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  IApiTransactionWithExtras,
  ITransactionsState,
  ModifyTransactionAction,
} from 'store/slices/transactionsSlice/types'
import {
  filterEnhancedTransactions,
  sortEnhancedTransactions,
} from 'src/subscriptions/utils'
import {
  IActivityTransaction,
  IEvent,
  TransactionsServerResponseWithActivityTransactions,
} from 'src/subscriptions/types'
import { resetSocketState } from 'store/shared/actions/resetSocketState'

const initialState: ITransactionsState = {
  next: '',
  prev: '',
  transactions: [],
  events: [],
}

const deserializeTransactions = (transactions: IActivityTransaction[]) =>
  transactions.sort(sortEnhancedTransactions).filter(filterEnhancedTransactions)

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addNewTransactions: (
      state,
      {
        payload,
      }: PayloadAction<TransactionsServerResponseWithActivityTransactions>,
    ) => {
      state.transactions = deserializeTransactions(
        state.transactions.concat(payload.activityTransactions || []),
      )
      state.next = payload.next || null
      state.prev = payload.prev || null
      return state
    },
    addNewTransaction: (
      state,
      { payload }: PayloadAction<IActivityTransaction>,
    ) => {
      state.transactions.push(payload)
      state.transactions = deserializeTransactions(state.transactions || [])
      return state
    },
    addNewEvent: (state, { payload }: PayloadAction<IEvent>) => {
      state.events.push(payload)
      return state
    },
    addPendingTransaction: (
      state,
      { payload }: PayloadAction<IApiTransactionWithExtras>,
    ) => {
      const { symbol, finalAddress, enhancedAmount, value, ...restPayload } =
        payload
      const pendingTransaction = {
        originTransaction: {
          ...restPayload,
          value: enhancedAmount || value,
        },
        enhancedTransaction: {
          symbol,
          from: restPayload.from,
          to: finalAddress,
          value: enhancedAmount,
        },
      }
      state.transactions.push(pendingTransaction)
      return state
    },
    modifyTransaction: (
      state,
      { payload }: PayloadAction<ModifyTransactionAction>,
    ) => {
      const indexOfTransactionToModify = state.transactions.findIndex(
        transaction => transaction.originTransaction.hash === payload.hash,
      )
      if (indexOfTransactionToModify !== -1) {
        state.transactions[indexOfTransactionToModify].originTransaction = {
          ...state.transactions[indexOfTransactionToModify].originTransaction,
          ...payload,
        }
      }
      state.transactions = deserializeTransactions(state.transactions || [])
      return state
    },
  },
  extraReducers: builder => {
    builder.addCase(resetSocketState, () => initialState)
  },
})

export const {
  addNewTransactions,
  addNewTransaction,
  addNewEvent,
  modifyTransaction,
  addPendingTransaction,
} = transactionsSlice.actions
export const transactionsReducer = transactionsSlice.reducer
