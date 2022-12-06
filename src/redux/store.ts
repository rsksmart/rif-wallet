import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createDebugger from 'redux-flipper'
import { persistStore } from 'redux-persist'
import { appStateReducer } from 'store/slices/appStateSlice/appStateSlice'
import { balancesReducer } from 'store/slices/balancesSlice/balancesSlice'
import { profileReducer } from './slices/profileSlice/profileSlice'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'

// Must use redux-debugger plugin in flipper for the redux debugger to work

const rootReducer = combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
  appState: appStateReducer,
  profile: profileReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddlewares => {
    const middlewares = getDefaultMiddlewares()
    if (__DEV__) {
      return middlewares.concat(createDebugger())
    }
    return middlewares
  },
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
