import { configureStore } from '@reduxjs/toolkit'
import createDebugger from 'redux-flipper'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'
import { balancesReducer } from 'store/slices/balancesSlice/balancesSlice'

// Must use redux-debugger plugin in flipper for the redux debugger to work

export const store = configureStore({
  reducer: {
    usdPrices: usdPriceReducer,
    balances: balancesReducer,
  },
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
