import { combineReducers } from '@reduxjs/toolkit'
import { accountsReducer } from './slices/accountsSlice/accountsSlice'
import { appStateReducer } from './slices/appStateSlice/appStateSlice'
import { balancesReducer } from './slices/balancesSlice/balancesSlice'
import { profileReducer } from './slices/profileSlice/profileSlice'
import { transactionsReducer } from './slices/transactionsSlice/transactionsSlice'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'

export const rootReducer = combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
  appState: appStateReducer,
  transactions: transactionsReducer,
  profile: profileReducer,
  accounts: accountsReducer,
})
