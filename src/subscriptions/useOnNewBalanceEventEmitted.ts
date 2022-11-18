import { addOrUpdateNewBalance } from 'store/slices/balancesSlice/balancesSlice'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

export const useOnNewBalanceEventEmitted = (
  dispatch: (payload: unknown) => void,
) => {
  return (payload: ITokenWithoutLogo) => {
    dispatch(addOrUpdateNewBalance(payload))
  }
}
