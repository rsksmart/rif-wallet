import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { IAccount, IProfileStore } from 'src/storage/MainStorage'
import { reduxStorage } from 'src/storage/ReduxStorage'

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

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
}

export const profileReducer = persistReducer(
  persistConfig,
  profileSlice.reducer,
)
