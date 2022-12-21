import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UsdPricesState } from './types'

const initialState: UsdPricesState = {}

const usdPricesSlice = createSlice({
  name: 'usdPrices',
  initialState,
  reducers: {
    setUsdPrices: (_state, action: PayloadAction<UsdPricesState>) => ({
      ...action.payload,
    }),
  },
})

export const { setUsdPrices } = usdPricesSlice.actions

export const usdPriceReducer = usdPricesSlice.reducer
