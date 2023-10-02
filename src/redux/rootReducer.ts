import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer, createMigrate, PersistConfig } from 'redux-persist'

import { reduxStorage } from 'storage/ReduxStorage'
import { contactsReducer } from 'store/slices/contactsSlice'
import { ProfileStatus } from 'navigation/profileNavigator/types'
import { getCurrentChainId } from 'storage/ChainStorage'
import {
  persistentDataReducer,
  PersistentDataState,
} from 'store/slices/persistentDataSlice'

import { accountsReducer } from './slices/accountsSlice'
import { balancesReducer } from './slices/balancesSlice'
import { profileReducer } from './slices/profileSlice'
import { settingsSliceReducer } from './slices/settingsSlice'
import { transactionsReducer } from './slices/transactionsSlice'
import { usdPriceReducer, UsdPricesState } from './slices/usdPricesSlice'
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

export const createRootReducer = () => {
  const persistedReduxStorageAcrossChainSwitches = reduxStorage(0)

  const settingsPersistConfig: PersistConfig<SettingsSlice> = {
    key: 'settings',
    whitelist: ['pin', 'usedBitcoinAddresses'],
    storage: reduxStorage(getCurrentChainId()),
  }

  const persistentDataPersistConfig: PersistConfig<PersistentDataState> = {
    key: 'persistentData',
    whitelist: ['keysExist', 'isFirstLaunch'],
    storage: persistedReduxStorageAcrossChainSwitches,
  }

  const usdPricesPersistConfig: PersistConfig<UsdPricesState> = {
    key: 'usdPrices',
    storage: persistedReduxStorageAcrossChainSwitches,
  }

  const rootPersistConfig = {
    key: 'root',
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
    storage: reduxStorage(getCurrentChainId()),
  }

  const reducers = combineReducers({
    usdPrices: persistReducer(usdPricesPersistConfig, usdPriceReducer),
    balances: balancesReducer,
    transactions: transactionsReducer,
    settings: persistReducer(settingsPersistConfig, settingsSliceReducer),
    profile: profileReducer,
    accounts: accountsReducer,
    contacts: contactsReducer,
    persistentData: persistReducer(
      persistentDataPersistConfig,
      persistentDataReducer,
    ),
  })

  return persistReducer(rootPersistConfig, reducers)
}
