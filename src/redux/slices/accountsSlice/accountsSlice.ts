import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccountPayload, IAccount } from './types'

const initialState: IAccount[] = [{ name: 'account 1' }]

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<AccountPayload>) => {
      const { index, account } = action.payload
      state[index] = account
    },
  },
})

export const { setAccount } = accountsSlice.actions

export const accountsReducer = accountsSlice.reducer
