import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IProfileStore } from './types'

const initialState = null as IProfileStore | null

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (_state, action: PayloadAction<IProfileStore>) =>
      action.payload,
    deleteProfile: () => null,
  },
})

export const { setProfile, deleteProfile } = profileSlice.actions

export const profileReducer = profileSlice.reducer

export * from './selector'
export * from './types'
