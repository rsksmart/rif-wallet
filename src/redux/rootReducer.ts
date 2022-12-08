import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { reduxStorage } from 'src/storage/ReduxStorage'
import { appStateReducer } from './slices/appStateSlice/appStateSlice'
import { balancesReducer } from './slices/balancesSlice/balancesSlice'
import { profileReducer } from './slices/profileSlice/profileSlice'
import { settingsSliceReducer } from './slices/settingsSlice'
import { transactionsReducer } from './slices/transactionsSlice/transactionsSlice'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['profile'],
}

const reducers = combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
  appState: appStateReducer,
  transactions: transactionsReducer,
  settings: settingsSliceReducer,
  profile: profileReducer,
})

export const rootReducer = persistReducer(persistConfig, reducers)
