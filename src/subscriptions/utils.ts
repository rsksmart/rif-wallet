import { IActivityTransaction } from './types'

export const sortEnhancedTransactions = (
  first: IActivityTransaction,
  second: IActivityTransaction,
) => {
  return second.originTransaction.timestamp - first.originTransaction.timestamp
}

export const filterEnhancedTransactions = (
  transaction: IActivityTransaction,
  index: number,
  self: Array<IActivityTransaction>,
) => {
  return (
    index ===
    self.findIndex(
      tx => tx.originTransaction.nonce === transaction.originTransaction.nonce,
    )
  )
}
