import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { PersistentDataState } from './types'

const initialState: PersistentDataState = {
  keysExist: false,
  isFirstLaunch: true,
}

/**
 * Data that will be persisted across chain ID switches
 */
const persistentDataSlice = createSlice({
  name: 'persistentData',
  initialState,
  reducers: {
    setKeysExist: (state, { payload }: PayloadAction<boolean>) => {
      state.keysExist = payload
    },
    setIsFirstLaunch: (state, { payload }: PayloadAction<boolean>) => {
      state.isFirstLaunch = payload
    },
  },
})

export const { setKeysExist, setIsFirstLaunch } = persistentDataSlice.actions

export const persistentDataReducer = persistentDataSlice.reducer

export * from './types'
export * from './selectors'
