import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { getProfile as getProfileFromStorage } from 'src/storage/MainStorage'
import { reduxStorage } from 'src/storage/ReduxStorage'
import { IProfileStore } from './types'

const profileSlice = createSlice({
  name: 'profile',
  initialState: getProfileFromStorage() || null,
  reducers: {
    setProfile: (_state, action: PayloadAction<IProfileStore>) => ({
      ...action.payload,
    }),
  },
})

export const { setProfile } = profileSlice.actions

const persistConfig = {
  key: 'PROFILE',
  storage: reduxStorage,
}

export const profileReducer = persistReducer(
  persistConfig,
  profileSlice.reducer,
)
