import { addNewTransactions } from 'store/slices/transactionsSlice/transactionsSlice'
import { TransactionsServerResponseWithActivityTransactions } from 'screens/activity/types'

export const useOnNewTransactionsEventEmitted = (dispatch: any) => {
  return (payload: TransactionsServerResponseWithActivityTransactions) => {
    dispatch(addNewTransactions(payload))
  }
}
