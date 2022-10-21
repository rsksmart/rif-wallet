import {
  IActivityTransaction,
  IBitcoinTransaction,
  ActivityMixedType,
} from './types'
import React from 'react'

export default function useTransactionsCombiner(
  rifTransactions: IActivityTransaction[],
  btcTransactions: (IBitcoinTransaction & { sortTime: number })[],
): ActivityMixedType[] {
  return React.useMemo(() => {
    // If any of them changed, then merge
    return [
      ...rifTransactions.map(rifTransaction => ({
        ...rifTransaction,
        id: rifTransaction.originTransaction.hash,
        sortTime: rifTransaction.originTransaction.timestamp,
      })),
      ...btcTransactions,
    ].sort(({ sortTime: a }, { sortTime: b }) => {
      return b - a
    })
  }, [rifTransactions, btcTransactions])
}
