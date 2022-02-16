import { createStore } from './NormalStore'
import { IActivityTransaction } from '../subscriptions/types'

const key = 'PENDING_TRANSACTIONS'
const PendingTransactionsStore = createStore(key)

export const getPendingTransactions = async () => {
  const pendingTransactions = JSON.parse(
    (await PendingTransactionsStore.has())
      ? await PendingTransactionsStore.get()!
      : '[]',
  )

  return pendingTransactions || []
}

export const removeAll = async () => {
  PendingTransactionsStore.remove()
}

export const addPendingTransaction = async (
  pendingTransaction: IActivityTransaction,
) => {
  let pendingTransactions = JSON.parse(
    (await PendingTransactionsStore.has())
      ? await PendingTransactionsStore.get()!
      : '[]',
  )

  if (!pendingTransactions) {
    pendingTransactions = []
  }
  pendingTransactions.push(pendingTransaction)
  PendingTransactionsStore.save(JSON.stringify(pendingTransactions))
  return pendingTransactions
}

export const removePendingTransactionByHash = async (hash: string) => {
  const pendingTransactions = JSON.parse(
    (await PendingTransactionsStore.has())
      ? await PendingTransactionsStore.get()!
      : '[]',
  )

  const updatedPendingTransactions = pendingTransactions.filter(
    (pendingTx: IActivityTransaction) => {
      return pendingTx.originTransaction.hash !== hash
    },
  )

  PendingTransactionsStore.save(JSON.stringify(updatedPendingTransactions))
  return updatedPendingTransactions
}

export const removePendingTransactionsInList = async (
  confirmedTransactions: IActivityTransaction[],
) => {
  for (let i = 0; i < confirmedTransactions.length; i++) {
    await removePendingTransactionByHash(
      confirmedTransactions[i].originTransaction.hash,
    )
  }
}
