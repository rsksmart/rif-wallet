import { setUsdPrices } from 'store/slices/usdPricesSlice'
import { NewPriceAction } from 'src/subscriptions/types'
import { AppDispatch } from 'src/redux'

export const useOnNewPriceEventEmitted = (dispatch: AppDispatch) => {
  return (payload: NewPriceAction['payload']) => {
    dispatch(setUsdPrices(payload))
  }
}
