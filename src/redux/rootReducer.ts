import { combineReducers } from '@reduxjs/toolkit'
import { appStateReducer } from './slices/appStateSlice/appStateSlice'
import { balancesReducer } from './slices/balancesSlice/balancesSlice'
import { profileReducer } from './slices/profileSlice/profileSlice'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'

export default combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
  appState: appStateReducer,
  profile: profileReducer,
})
