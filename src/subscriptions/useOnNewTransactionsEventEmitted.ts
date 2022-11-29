import { addNewTransactions } from 'store/slices/transactionsSlice/transactionsSlice'
import { TransactionsServerResponseWithActivityTransactions } from 'screens/activity/types'
import { AppDispatch } from 'src/redux'

export const useOnNewTransactionsEventEmitted = (dispatch: AppDispatch) => {
  return (payload: TransactionsServerResponseWithActivityTransactions) => {
    dispatch(addNewTransactions(payload))
  }
}
