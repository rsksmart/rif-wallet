import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProfileStore } from './types'

const initialState: ProfileStore = {
  alias: '',
  phone: '',
  email: '',
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (_state, action: PayloadAction<ProfileStore>) => {
      _state = action.payload
    },
    deleteProfile: () => initialState,
  },
})

export const { setProfile, deleteProfile } = profileSlice.actions

export const profileReducer = profileSlice.reducer
