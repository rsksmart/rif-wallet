import { useOnNewPriceEventEmitted } from './useOnNewPriceEventEmitted'
import { useAppDispatch } from 'store/storeHooks'
import { useOnNewTransactionEventEmitted } from './useOnNewTransactionEventEmitted'
import { Action, ISocketsChangeEmitted } from './types'
import { IServiceChangeEvent } from 'lib/rifWalletServices/RifWalletServicesSocket'
import { useOnNewTransactionsEventEmitted } from 'src/subscriptions/useOnNewTransactionsEventEmitted'
import { useOnNewBalanceEventEmitted } from 'src/subscriptions/useOnNewBalanceEventEmitted'
import { resetSocketState } from 'store/shared/resetSocketState'

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
    dispatch: dispatchRedux,
  })
  const onNewTransactionsEventEmitted =
    useOnNewTransactionsEventEmitted(dispatchRedux)
  const onNewBalanceEventEmitted = useOnNewBalanceEventEmitted(dispatchRedux)
  return ({ type, payload }: IServiceChangeEvent) => {
    switch (type) {
      case 'newPrice':
        onNewPriceEventEmitted(payload)
        break
      case 'newTransaction':
        onNewTransactionEventEmitted(payload)
        break
      case 'newTransactions':
        onNewTransactionsEventEmitted(payload)
        break
      case 'newBalance':
        onNewBalanceEventEmitted(payload)
        break
      case 'reset':
        dispatchRedux(resetSocketState())
        break
      default:
        dispatch({ type, payload } as Action)
    }
  }
}
