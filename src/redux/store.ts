import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createDebugger from 'redux-flipper'
import { balancesReducer } from './slices/balancesSlice/balancesSlice'
import { profileReducer } from './slices/profileSlice/profileSlice'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'

// Must use redux-debugger plugin in flipper for the redux debugger to work

const rootReducer = combineReducers({
  usdPrices: usdPriceReducer,
  balances: balancesReducer,
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
