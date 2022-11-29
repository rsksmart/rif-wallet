import { useOnNewPriceEventEmitted } from './useOnNewPriceEventEmitted'
import { useOnNewTransactionEventEmitted } from './useOnNewTransactionEventEmitted'
import { ISocketsChangeEmitted } from './types'
import { IServiceChangeEvent } from 'lib/rifWalletServices/RifWalletServicesSocket'
import { useOnNewTransactionsEventEmitted } from 'src/subscriptions/useOnNewTransactionsEventEmitted'
import { useOnNewBalanceEventEmitted } from 'src/subscriptions/useOnNewBalanceEventEmitted'
import { resetSocketState } from 'store/shared/resetSocketState'
import { addOrUpdateBalances } from 'src/redux/slices/balancesSlice/balancesSlice'

export const useOnSocketChangeEmitted = ({
  dispatch,
  abiEnhancer,
  wallet,
}: ISocketsChangeEmitted) => {
  const onNewPriceEventEmitted = useOnNewPriceEventEmitted(dispatch)
  const onNewTransactionEventEmitted = useOnNewTransactionEventEmitted({
    abiEnhancer,
    wallet,
    dispatch: dispatch,
  })
  const onNewTransactionsEventEmitted =
    useOnNewTransactionsEventEmitted(dispatch)
  const onNewBalanceEventEmitted = useOnNewBalanceEventEmitted(dispatch)
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
        dispatch(resetSocketState())
        break
      case 'init':
        onNewTransactionsEventEmitted({
          data: [],
          next: undefined,
          prev: undefined,
          activityTransactions: payload.transactions,
        })
        dispatch(addOrUpdateBalances(payload.balances))
        break
      default:
        throw new Error(`${type} not implemented`)
    }
  }
}
