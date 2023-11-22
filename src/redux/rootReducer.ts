import { combineReducers } from '@reduxjs/toolkit'
import {
  createMigrate,
  getStoredState,
  PersistConfig,
  persistReducer,
} from 'redux-persist'

import { ProfileStatus } from 'navigation/profileNavigator/types'
import { getCurrentChainId } from 'storage/ChainStorage'
import { reduxStorage } from 'storage/ReduxStorage'
import { contactsReducer } from 'store/slices/contactsSlice'
import {
  persistentDataReducer,
  PersistentDataState,
} from 'store/slices/persistentDataSlice'

import { accountsReducer } from './slices/accountsSlice'
import { balancesReducer } from './slices/balancesSlice'
import { profileReducer } from './slices/profileSlice'
import { settingsSliceReducer } from './slices/settingsSlice'
import { SettingsSlice } from './slices/settingsSlice/types'
import { transactionsReducer } from './slices/transactionsSlice'
import { usdPriceReducer, UsdPricesState } from './slices/usdPricesSlice'

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

const firstPersistentDataMigration = async state => {
  // First migration, check if state already exists
  if (!state) {
    // First step is to get old settings storage - usually testnet storage has all the info
    const oldStorage = await getStoredState({
      key: 'settings',
      storage: reduxStorage(31),
    })
    // If old storage exists, we will migrate it to the current state
    if (oldStorage) {
      return {
        keysExist: oldStorage.keysExist,
        isFirstLaunch: oldStorage.isFirstLaunch,
        pin: oldStorage.pin,
      }
    }
  }
  return state
}

export const createRootReducer = () => {
  const persistedReduxStorageAcrossChainSwitches = reduxStorage(0)

  const settingsPersistConfig: PersistConfig<SettingsSlice> = {
    key: 'settings',
    whitelist: ['usedBitcoinAddresses'],
    storage: reduxStorage(getCurrentChainId()),
  }

  const persistentDataPersistConfig: PersistConfig<PersistentDataState> = {
    key: 'persistentData',
    whitelist: ['keysExist', 'isFirstLaunch', 'pin'],
    storage: persistedReduxStorageAcrossChainSwitches,
    migrate: firstPersistentDataMigration,
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
