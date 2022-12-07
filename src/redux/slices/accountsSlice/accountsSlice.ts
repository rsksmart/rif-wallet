import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { getAccounts as getAccountsFromStorage } from 'src/storage/MainStorage'
import { reduxStorage } from 'src/storage/ReduxStorage'
import { AccountAction, IAccount } from './types'

const initialState: IAccount[] = [{ name: 'account 1' }]

const profileSlice = createSlice({
  name: 'accounts',
  initialState: getAccountsFromStorage() || initialState,
  reducers: {
    updateAccount: (state, action: PayloadAction<AccountAction>) => {
      if (action.payload.index < state.accounts.length) {
        state.accounts[action.payload.index] = action.payload.account
      }
    },
    addAccount: (state, action: PayloadAction<IAccount>) => {
      state.accounts.push(action.payload)
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
