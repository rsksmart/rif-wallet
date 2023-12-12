import moment from 'moment'

import { RootState } from 'src/redux'
import { ActivityRowPresentationObject } from 'store/slices/transactionsSlice/types'

export const selectTransactions = ({ transactions }: RootState) =>
  transactions.transactions

export const selectTransactionsLoading = ({ transactions }: RootState) =>
  transactions.loading

/**
 * This function iterates over an array of transactions (which is pre-sorted by date in descending order)
 * It identifies RSK transactions; and checks if it's pending; then adds it to a temp array var, and returns this array.
 * The function imposes two constraints during iteration:
 *  Date Constraint: The iteration stops if it encounters a transaction that is older than 2 days from the current date.
 *  Transaction Count Constraint: The iteration stops if it has processed 100 transactions without finding any pending transactions.
 *  Output limit Constraint: Maximum pending txs to return is 5
 * These constraints are implemented to increase performance
 * as it's impossible to have a tx that has not been confirmed or cancelled in the last 2 days.
 * @param transactions
 */
export const selectRecentRskTransactions = ({
  transactions: { transactions },
}: RootState) => {
  const TWO_DAYS_UNIX = moment().subtract(2, 'days').unix()
  const MAX_TRANSACTION_COUNT = 100
  const MAX_OUTPUT_TRANSACTIONS = 5
  const output: ActivityRowPresentationObject[] = []

  for (let i = 0; i < transactions.length && i < MAX_TRANSACTION_COUNT; i++) {
    const transaction = transactions[i]
    // Check if transaction is more than 2 days old
    if (transaction.timestamp < TWO_DAYS_UNIX) {
      break
    }

    // Check if transaction is rsk and is pending
    if ('original' in transaction && transaction.status === 'pending') {
      output.push(transaction)
    }
    if (output.length >= MAX_OUTPUT_TRANSACTIONS) {
      break
    }
  }
  return output
}
