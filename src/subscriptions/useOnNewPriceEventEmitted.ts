import { setUsdPrices } from 'store/slices/usdPricesSlice'

export const useOnNewPriceEventEmitted = (dispatch: any) => {
  return (payload: any) => {
    dispatch(setUsdPrices(payload))
  }
}
