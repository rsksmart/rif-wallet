import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ITransactionsState } from 'store/slices/transactionsSlice/types'
import {
  filterEnhancedTransactions,
  sortEnhancedTransactions,
} from 'src/subscriptions/utils'
import { IActivityTransaction } from 'src/subscriptions/types'

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
      { payload }: PayloadAction<ITransactionsState>,
    ) => {
      state.transactions = deserializeTransactions(
        state.transactions.concat(payload.transactions),
      )
      state.next = payload.next
      state.prev = payload.prev
      return state
    },
    setNewTransactions: (
      state,
      { payload }: PayloadAction<ITransactionsState>,
    ) => {
      state.transactions = deserializeTransactions(payload.transactions)
      state.next = payload.next
      state.prev = payload.prev
      return state
    },
  },
})

export const { addNewTransactions, setNewTransactions } =
  transactionsSlice.actions
export const transactionsReducer = transactionsSlice.reducer
