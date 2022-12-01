import { useOnNewTransactionEventEmitted } from './useOnNewTransactionEventEmitted'
import { ISocketsChangeEmitted } from './types'
import { IServiceChangeEvent } from 'lib/rifWalletServices/RifWalletServicesSocket'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import {
  addOrUpdateBalances,
  addOrUpdateNewBalance,
} from 'src/redux/slices/balancesSlice/balancesSlice'
import { setIsSetup } from 'store/slices/appStateSlice/appStateSlice'
import {
  addNewEvent,
  addNewTransactions,
} from 'store/slices/transactionsSlice/transactionsSlice'
import { setUsdPrices } from 'store/slices/usdPricesSlice'

export const useOnSocketChangeEmitted = ({
  dispatch,
  abiEnhancer,
  wallet,
}: ISocketsChangeEmitted) => {
  const onNewTransactionEventEmitted = useOnNewTransactionEventEmitted({
    abiEnhancer,
    wallet,
    dispatch: dispatch,
  })
  return ({ type, payload }: IServiceChangeEvent) => {
    switch (type) {
      case 'newPrice':
        dispatch(setUsdPrices(payload))
        break
      case 'newTransaction':
        onNewTransactionEventEmitted(payload)
        break
      case 'newTransactions':
        dispatch(addNewTransactions(payload))
        break
      case 'newBalance':
        dispatch(addOrUpdateNewBalance(payload))
        break
      case 'reset':
        dispatch(resetSocketState())
        break
      case 'init':
        dispatch(
          addNewTransactions({
            data: [],
            next: undefined,
            prev: undefined,
            activityTransactions: payload.transactions,
          }),
        )
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
