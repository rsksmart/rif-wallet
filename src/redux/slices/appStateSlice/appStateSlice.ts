import { AppState } from 'store/slices/appStateSlice/types'
import { createSlice } from '@reduxjs/toolkit'
import { resetSocketState } from 'store/shared/actions/resetSocketState'

const initialState: AppState = {
  isSetup: false,
}

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setIsSetup: (state, { payload }: { payload: boolean }) => {
      state.isSetup = payload
      return state
    },
  },
  extraReducers: builder => {
    builder.addCase(resetSocketState, () => initialState)
  },
})

export const { setIsSetup } = appStateSlice.actions
export const appStateReducer = appStateSlice.reducer
