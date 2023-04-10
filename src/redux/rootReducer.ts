import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer, createMigrate } from 'redux-persist'

import { reduxStorage } from 'storage/ReduxStorage'
import { contactsReducer } from 'store/slices/contactsSlice'
import { ProfileStatus } from 'navigation/profileNavigator/types'

import { accountsReducer } from './slices/accountsSlice'
import { balancesReducer } from './slices/balancesSlice'
import { profileReducer } from './slices/profileSlice'
import { settingsPersist, settingsSliceReducer } from './slices/settingsSlice'
import { transactionsReducer } from './slices/transactionsSlice'
import { usdPriceReducer } from './slices/usdPricesSlice'

const migrations = {
  // It's on purpose due to state type from redux-persist is PersistedStated.
  // Also, to don't add complexity to typing. More about this issue in https://github.com/rt2zz/redux-persist/issues/1140
  // eslint-disable-next-line
  0: (state: any) => ({
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
  migrate: createMigrate(migrations),
  whitelist: ['profile', 'accounts', 'contacts', 'balances', 'usdPrices'],
}

const reducers = combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
  transactions: transactionsReducer,
  settings: persistReducer(settingsPersist, settingsSliceReducer),
  profile: profileReducer,
  accounts: accountsReducer,
  contacts: contactsReducer,
})

export const rootReducer = persistReducer(persistConfig, reducers)
