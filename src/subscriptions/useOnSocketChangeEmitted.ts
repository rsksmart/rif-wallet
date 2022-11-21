import { useOnNewPriceEventEmitted } from './useOnNewPriceEventEmitted'
import { useAppDispatch } from 'store/storeHooks'
import { useOnNewTransactionEventEmitted } from './useOnNewTransactionEventEmitted'
import { Action, ISocketsChangeEmitted } from './types'

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
  return ({ type, payload }: Action) => {
    if (type === 'newPrice') {
      onNewPriceEventEmitted(payload)
    } else if (type === 'newTransaction') {
      onNewTransactionEventEmitted(payload)
    } else {
      dispatch({ type, payload } as Action)
    }
  }
}
