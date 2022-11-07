import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IUsdPrice {
  lastUpdated: string
  price: number
}
export interface UsdPricesState {
  [id: string]: IUsdPrice
}

const initialState: UsdPricesState = {}

const usdPricesSlice = createSlice({
  name: 'usdPrices',
  initialState,
  reducers: {
    setUsdPrices: (state, action: PayloadAction<UsdPricesState>) => {
      state = action.payload
    },
  },
})

export const { setUsdPrices } = usdPricesSlice.actions

export const usdPriceReducer = usdPricesSlice.reducer
