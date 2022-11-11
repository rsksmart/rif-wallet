import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUsdPricesState } from './types'

const initialState: IUsdPricesState = {}

const usdPricesSlice = createSlice({
  name: 'usdPrices',
  initialState,
  reducers: {
    setUsdPrices: (state, action: PayloadAction<IUsdPricesState>) => ({
      ...action.payload,
    }),
  },
})

export const { setUsdPrices } = usdPricesSlice.actions

export const usdPriceReducer = usdPricesSlice.reducer
