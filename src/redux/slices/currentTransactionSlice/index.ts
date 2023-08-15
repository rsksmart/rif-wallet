import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { TransactionInformation } from './types'

const initialState: TransactionInformation = {
  status: 'NONE',
}

const currentTransactionSlice = createSlice({
  name: 'currentTransaction',
  initialState,
  reducers: {
    setCurrentTransaction: (_, action: PayloadAction<TransactionInformation>) =>
      action.payload,
    deleteCurrentTransaction: () => initialState,
  },
})

export const { setCurrentTransaction, deleteCurrentTransaction } =
  currentTransactionSlice.actions

export const currentTransactionReducer = currentTransactionSlice.reducer

export * from './selector'
