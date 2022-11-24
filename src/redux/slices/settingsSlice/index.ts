import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ColorValue } from 'react-native'
import { colors } from 'src/styles'
import { SettingsSlice } from './types'

const initialState: SettingsSlice = {
  topColor: colors.darkPurple3,
}

const settingsSlice = createSlice({
  name: 'usdPrices',
  initialState,
  reducers: {
    changeTopColor: (state, action: PayloadAction<ColorValue>) => {
      state.topColor = action.payload
    },
  },
})

export const { changeTopColor } = settingsSlice.actions

export const settingsSliceReducer = settingsSlice.reducer
