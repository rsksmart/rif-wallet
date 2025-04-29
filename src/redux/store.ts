import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  // FLUSH,
  // REHYDRATE,
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
} from 'redux-persist'
import Config from 'react-native-config'

import { createRootReducer } from './rootReducer'

// Must use redux-debugger plugin in flipper for the redux debugger to work

export const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: createRootReducer(),
    preloadedState,
    middleware: getDefaultMiddlewares => {
      const middlewares = getDefaultMiddlewares({
        serializableCheck: false,
      })

      if (__DEV__ && Config.NO_FLIPPER !== '1') {
        try {
          // we need this to import this middleware syncronously
          // because createStore expects an immediate return
          /* eslint-disable @typescript-eslint/no-var-requires */
          const createDebugger = require('redux-flipper').default
          /* eslint-enable @typescript-eslint/no-var-requires */
          middlewares.push(createDebugger())
        } catch (e) {
          console.warn('Redux Flipper not available, skipping.')
        }
      }

      return middlewares
    },
  })

export const store = createStore()

export const createNewStore = () => {
  const newStore = createStore()
  const newPersistor = persistStore(newStore)
  return {
    store: newStore,
    persistor: newPersistor,
  }
}
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
