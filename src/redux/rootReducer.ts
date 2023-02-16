import { combineReducers, Reducer } from '@reduxjs/toolkit'
import { persistReducer, createMigrate, MigrationManifest } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import { reduxStorage } from 'storage/ReduxStorage'
import { accountsReducer } from './slices/accountsSlice'
import { balancesReducer } from './slices/balancesSlice'
import { contactsReducer } from 'store/slices/contactsSlice'
import { profileReducer } from './slices/profileSlice'
import { settingsSliceReducer } from './slices/settingsSlice'
import { transactionsReducer } from './slices/transactionsSlice'
import { usdPriceReducer } from './slices/usdPricesSlice'
import { ProfileStatus } from 'navigation/profileNavigator/types'
import { RootState } from '.'

const migrations: MigrationManifest = {
  0: (state: RootState) => ({
    ...state,
    profile: {
      alias: '',
      phone: '',
      email: '',
      status: ProfileStatus.NONE,
    },
  }),
}

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  version: 0,
  stateReconciler: autoMergeLevel2,
  migrate: createMigrate(migrations),
  whitelist: ['profile', 'accounts', 'contacts', 'balances', 'usdPrices'],
}

const reducers: Reducer = combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
  transactions: transactionsReducer,
  settings: settingsSliceReducer,
  profile: profileReducer,
  accounts: accountsReducer,
  contacts: contactsReducer,
})

export const rootReducer = persistReducer(persistConfig, reducers)
