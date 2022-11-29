import { useOnNewPriceEventEmitted } from './useOnNewPriceEventEmitted'
import { useOnNewTransactionEventEmitted } from './useOnNewTransactionEventEmitted'
import { ISocketsChangeEmitted } from './types'
import { IServiceChangeEvent } from 'lib/rifWalletServices/RifWalletServicesSocket'
import { useOnNewTransactionsEventEmitted } from 'src/subscriptions/useOnNewTransactionsEventEmitted'
import { useOnNewBalanceEventEmitted } from 'src/subscriptions/useOnNewBalanceEventEmitted'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { addOrUpdateBalances } from 'src/redux/slices/balancesSlice/balancesSlice'
import { setIsSetup } from 'store/slices/appStateSlice/appStateSlice'
import { addNewEvent } from 'store/slices/transactionsSlice/transactionsSlice'

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
        dispatch(setIsSetup(true))
        break
      case 'newTokenTransfer':
        // This is not being used anywhere
        dispatch(addNewEvent(payload))
        break
      default:
        throw new Error(`${type} not implemented`)
    }
  }
}
