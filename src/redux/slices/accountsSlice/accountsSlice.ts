import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { getAccounts as getAccountsFromStorage } from 'src/storage/MainStorage'
import { reduxStorage } from 'src/storage/ReduxStorage'
import { IAccount } from './types'

const initialState: IAccount[] = [{ name: 'account 1' }]

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: getAccountsFromStorage() || initialState,
  reducers: {
    setAccounts: (_state, action: PayloadAction<IAccount[]>) => action.payload,
  },
})

export const { setAccounts } = accountsSlice.actions

const persistConfig = {
  key: 'ACCOUNTS',
  storage: reduxStorage,
}

export const accountsReducer = persistReducer(
  persistConfig,
  accountsSlice.reducer,
)
