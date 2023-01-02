import { IActivityTransaction, IEvent } from './types'

export const sortEnhancedTransactions = (
  first: IActivityTransaction,
  second: IActivityTransaction,
) => {
  return second.originTransaction.timestamp - first.originTransaction.timestamp
}
/**
 * This function will filter out the transactions that are repeated
 * @param transaction
 * @param index
 * @param self
 */
export const filterEnhancedTransactions = (
  transaction: IActivityTransaction,
  index: number,
  self: Array<IActivityTransaction>,
) => {
  return (
    index ===
    self.findIndex(
      tx => tx.originTransaction.hash === transaction.originTransaction.hash,
    )
  )
}

export const isOutgoinEvent = (event: IEvent, currentAddress: string) => {
  const from = event.args[0]
  return from === currentAddress.toLowerCase()
}

export const isIncomingEvent = (event: IEvent, currentAddress: string) => {
  const to = event.args[1]
  return to === currentAddress.toLowerCase()
}
