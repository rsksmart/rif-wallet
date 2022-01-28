import { IActivityTransaction } from './types'

export const sortEnhancedTransactions = (
  first: IActivityTransaction,
  second: IActivityTransaction,
) => {
  return second.originTransaction.nonce - first.originTransaction.nonce
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
