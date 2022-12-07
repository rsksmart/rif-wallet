import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IProfileStore } from './types'

const initialState = null as IProfileStore | null

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (_state, action: PayloadAction<IProfileStore>) =>
      action.payload,
    eraseProfile: () => null,
  },
})

export const { setProfile, eraseProfile } = profileSlice.actions

export const profileReducer = profileSlice.reducer
