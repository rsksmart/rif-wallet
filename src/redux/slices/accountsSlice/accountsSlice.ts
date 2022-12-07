import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { getAccounts as getAccountsFromStorage } from 'src/storage/MainStorage'
import { reduxStorage } from 'src/storage/ReduxStorage'
import { AccountPayload, IAccount } from './types'

const initialState: IAccount[] = [{ name: 'account 1' }]

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: getAccountsFromStorage() || initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<AccountPayload>) => {
      const { index, account } = action.payload
      state[index] = account
    },
  },
})

export const { setAccount } = accountsSlice.actions

const persistConfig = {
  key: 'ACCOUNTS',
  storage: reduxStorage,
}

export const accountsReducer = persistReducer(
  persistConfig,
  accountsSlice.reducer,
)
