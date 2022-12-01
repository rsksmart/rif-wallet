import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAccount, IProfileStore } from 'src/storage/MainStorage'

const initialState: IProfileStore = {
  alias: '',
  phone: '',
  email: '',
  accounts: [{ name: '' }],
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
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
