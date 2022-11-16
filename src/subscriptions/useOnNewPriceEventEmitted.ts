import React from 'react'
import { setUsdPrices } from '../redux/slices/usdPricesSlice/usdPricesSlice'

export const useOnNewPriceEventEmitted = (dispatch: any) => {
  return React.useCallback(
    payload => {
      dispatch(setUsdPrices(payload))
    },
    [dispatch],
  )
}
