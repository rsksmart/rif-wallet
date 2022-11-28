import { useOnNewPriceEventEmitted } from './useOnNewPriceEventEmitted'
import { useAppDispatch } from 'store/storeHooks'
import { useOnNewTransactionEventEmitted } from './useOnNewTransactionEventEmitted'
import { Action, ISocketsChangeEmitted } from './types'
import { IServiceChangeEvent } from 'lib/rifWalletServices/RifWalletServicesSocket'
import { useOnNewBalanceEventEmitted } from 'src/subscriptions/useOnNewBalanceEventEmitted'

export const useOnSocketChangeEmitted = ({
  dispatch,
  abiEnhancer,
  wallet,
}: ISocketsChangeEmitted) => {
  const dispatchRedux = useAppDispatch()
  const onNewPriceEventEmitted = useOnNewPriceEventEmitted(dispatchRedux)
  const onNewTransactionEventEmitted = useOnNewTransactionEventEmitted({
    abiEnhancer,
    wallet,
    dispatch,
  })
  const onNewBalanceEventEmitted = useOnNewBalanceEventEmitted(dispatchRedux)
  return ({ type, payload }: IServiceChangeEvent) => {
    if (type === 'newPrice') {
      onNewPriceEventEmitted(payload)
    } else if (type === 'newTransaction') {
      onNewTransactionEventEmitted(payload)
    } else if (type === 'newBalance') {
      onNewBalanceEventEmitted(payload)
    } else {
      dispatch({ type, payload } as Action)
    }
  }
}
