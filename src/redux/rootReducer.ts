import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer, createMigrate, PersistConfig } from 'redux-persist'

import { reduxStorage } from 'storage/ReduxStorage'
import { contactsReducer } from 'store/slices/contactsSlice'
import { ProfileStatus } from 'navigation/profileNavigator/types'

import { accountsReducer } from './slices/accountsSlice'
import { balancesReducer } from './slices/balancesSlice'
import { profileReducer } from './slices/profileSlice'
import { settingsSliceReducer } from './slices/settingsSlice'
import { transactionsReducer } from './slices/transactionsSlice'
import { usdPriceReducer } from './slices/usdPricesSlice'
import { SettingsSlice } from './slices/settingsSlice/types'

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

const settingsPersistConfig: PersistConfig<SettingsSlice> = {
  key: 'settings',
  whitelist: ['pin', 'chainId', 'isFirstLaunch', 'usedBitcoinAddresses'],
  storage: reduxStorage,
}

const rootPersistConfig = {
  key: 'root',
  storage: reduxStorage,
  version: 0,
  migrate: createMigrate(migrations),
  whitelist: [
    'profile',
    'accounts',
    'contacts',
    'balances',
    'usdPrices',
    'transactions',
  ],
}

const reducers = combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
  transactions: transactionsReducer,
  settings: persistReducer(settingsPersistConfig, settingsSliceReducer),
  profile: profileReducer,
  accounts: accountsReducer,
  contacts: contactsReducer,
})

export const rootReducer = persistReducer(rootPersistConfig, reducers)
