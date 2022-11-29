import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  BalanceState,
  ITokenWithoutLogo,
} from 'store/slices/balancesSlice/types'

const initialState: BalanceState = {}

export const balancesSlice = createSlice({
  name: 'balances',
  initialState,
  reducers: {
    addOrUpdateNewBalance: (
      state,
      action: PayloadAction<ITokenWithoutLogo>,
    ) => {
      state[action.payload.contractAddress] = {
        ...action.payload,
      }
      return state
    },
  },
})

export const { addOrUpdateNewBalance } = balancesSlice.actions
export const balancesReducer = balancesSlice.reducer