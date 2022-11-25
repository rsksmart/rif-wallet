import { configureStore } from '@reduxjs/toolkit'
import { usdPriceReducer } from './slices/usdPricesSlice/usdPricesSlice'

// Must use redux-debugger plugin in flipper for the redux debugger to work

export const store = configureStore({
  reducer: {
    usdPrices: usdPriceReducer,
  },
  middleware: getDefaultMiddlewares => {
    let middlewares = getDefaultMiddlewares()
    if (__DEV__) {
      return middlewares.concat(require('redux-flipper').default())
    }
    return middlewares
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
