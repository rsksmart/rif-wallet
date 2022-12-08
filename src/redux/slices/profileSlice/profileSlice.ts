import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getProfile, IAccount, IProfileStore } from 'src/storage/MainStorage'

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

export const profileReducer = profileSlice.reducer
