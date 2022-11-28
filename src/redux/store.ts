import { configureStore } from '@reduxjs/toolkit'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'
import { balancesReducer } from 'store/slices/balancesSlice/balancesSlice'

export const store = configureStore({
  reducer: {
    usdPrices: usdPriceReducer,
    balances: balancesReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
