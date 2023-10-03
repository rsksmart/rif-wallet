import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { PersistentDataState } from './types'

// @TODO switch back variable state after 15 days - 1 month (november) (keysExist false by default, isFirst.. true by default)
const initialState: PersistentDataState = {
  keysExist: true,
  isFirstLaunch: false,
  pin: null,
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
    setPinState: (state, { payload }: PayloadAction<string | null>) => {
      state.pin = payload
    },
  },
})

export const { setKeysExist, setIsFirstLaunch, setPinState } =
  persistentDataSlice.actions

export const persistentDataReducer = persistentDataSlice.reducer

export * from './types'
export * from './selectors'
