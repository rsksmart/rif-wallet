import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  BalanceState,
  ITokenWithoutLogo,
} from 'store/slices/balancesSlice/types'
import { resetSocketState } from 'store/shared/actions/resetSocketState'

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
    addOrUpdateBalances: (
      state,
      { payload }: PayloadAction<ITokenWithoutLogo[]>,
    ) => {
      payload.map(token => {
        state[token.contractAddress] = token
      })
      return state
    },
  },
  extraReducers: builder => {
    builder.addCase(resetSocketState, () => initialState)
  },
})

export const { addOrUpdateNewBalance, addOrUpdateBalances } =
  balancesSlice.actions
export const balancesReducer = balancesSlice.reducer
