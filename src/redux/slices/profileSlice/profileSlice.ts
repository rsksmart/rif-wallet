import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { getProfile, IAccount, IProfileStore } from 'src/storage/MainStorage'
import { reduxStorage } from 'src/storage/ReduxStorage'

const emptyProfile: IProfileStore = {
  alias: '',
  phone: '',
  email: '',
  accounts: [{ name: '' }],
}

const profileSlice = createSlice({
  name: 'profile',
  initialState: getProfile() || emptyProfile,
  reducers: {
    setProfile: (_state, action: PayloadAction<IProfileStore>) => ({
      ...action.payload,
    }),
    setAccount: (
      state,
      action: PayloadAction<{ index: number; account: IAccount }>,
    ) => {
      state.accounts[action.payload.index] = action.payload.account
      return state
    },
  },
})

export const { setProfile, setAccount } = profileSlice.actions

const persistConfig = {
  key: 'PROFILE',
  storage: reduxStorage,
}

export const profileReducer = persistReducer(
  persistConfig,
  profileSlice.reducer,
)
