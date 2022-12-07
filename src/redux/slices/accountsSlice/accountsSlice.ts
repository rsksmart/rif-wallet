import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { getAccounts as getAccountsFromStorage } from 'src/storage/MainStorage'
import { reduxStorage } from 'src/storage/ReduxStorage'
import { AccountAction as AccountPayload, IAccount } from './types'

const initialState: IAccount[] = [{ name: 'account 1' }]

const profileSlice = createSlice({
  name: 'accounts',
  initialState: getAccountsFromStorage() || initialState,
  reducers: {
    updateAccount: (state, action: PayloadAction<AccountPayload>) => {
      state[action.payload.index] = action.payload.account
    },
  },
})

export const { updateAccount } = profileSlice.actions

const persistConfig = {
  key: 'ACCOUNTS',
  storage: reduxStorage,
}

export const accountsReducer = persistReducer(
  persistConfig,
  profileSlice.reducer,
)
