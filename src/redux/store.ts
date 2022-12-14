import { configureStore } from '@reduxjs/toolkit'
import createDebugger from 'redux-flipper'
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { rootReducer } from './rootReducer'

// Must use redux-debugger plugin in flipper for the redux debugger to work

export const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddlewares => {
      const middlewares = getDefaultMiddlewares({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            'transactions/addNewTransactions',
          ],
        },
      })
      if (__DEV__) {
        return middlewares.concat(createDebugger())
      }
      return middlewares
    },
  })

export const store = createStore()

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export interface AsyncThunkWithTypes {
  state: RootState
  dispatch: AppDispatch
  rejectValue: string
  extra?: { s: string; n: number }
}
