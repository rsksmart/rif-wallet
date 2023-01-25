import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { reduxStorage } from 'src/storage/ReduxStorage'
import { accountsReducer } from './slices/accountsSlice/accountsSlice'
import { balancesReducer } from './slices/balancesSlice'
import { contactsReducer } from 'store/slices/contactsSlice'
import { profileReducer } from './slices/profileSlice/profileSlice'
import { settingsSliceReducer } from './slices/settingsSlice'
import { transactionsReducer } from './slices/transactionsSlice/transactionsSlice'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['profile', 'accounts', 'contacts'],
}

const reducers = combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
  transactions: transactionsReducer,
  settings: settingsSliceReducer,
  profile: profileReducer,
  accounts: accountsReducer,
  contacts: contactsReducer,
})

export const rootReducer = persistReducer(persistConfig, reducers)
