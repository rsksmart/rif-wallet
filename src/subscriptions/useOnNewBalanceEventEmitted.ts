import { addOrUpdateNewBalance } from 'store/slices/balancesSlice/balancesSlice'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { AppDispatch } from 'src/redux'

export const useOnNewBalanceEventEmitted = (dispatch: AppDispatch) => {
  return (payload: ITokenWithoutLogo) => {
    dispatch(addOrUpdateNewBalance(payload))
  }
}
