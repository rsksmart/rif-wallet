import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ITransactionsState } from 'store/slices/transactionsSlice/types'
import {
  filterEnhancedTransactions,
  sortEnhancedTransactions,
} from 'src/subscriptions/utils'
import { IActivityTransaction } from 'src/subscriptions/types'
import { TransactionsServerResponseWithActivityTransactions } from 'src/screens/activity/types'
import { resetSocketState } from 'store/shared/resetSocketState'

const initialState: ITransactionsState = {
  next: '',
  prev: '',
  transactions: [],
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
      state.next = payload.next
      state.prev = payload.prev
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
  },
  extraReducers: builder => {
    builder.addCase(resetSocketState, () => initialState)
  },
})

export const { addNewTransactions, addNewTransaction } =
  transactionsSlice.actions
export const transactionsReducer = transactionsSlice.reducer
