import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { reduxStorage } from 'src/storage/ReduxStorage'
import { accountsReducer } from './slices/accountsSlice/accountsSlice'
import { appStateReducer } from './slices/appStateSlice/appStateSlice'
import { balancesReducer } from './slices/balancesSlice/balancesSlice'
import { profileReducer } from './slices/profileSlice/profileSlice'
import { settingsSliceReducer } from './slices/settingsSlice'
import { transactionsReducer } from './slices/transactionsSlice/transactionsSlice'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['profile', 'accounts'],
}

const reducers = combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
  appState: appStateReducer,
  transactions: transactionsReducer,
  settings: settingsSliceReducer,
  profile: profileReducer,
  accounts: accountsReducer,
})

export const rootReducer = persistReducer(persistConfig, reducers)
