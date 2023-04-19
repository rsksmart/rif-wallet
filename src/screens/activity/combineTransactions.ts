import {
  IActivityTransaction,
  IBitcoinTransaction,
  ActivityMixedType,
} from './types'

export function combineTransactions(
  rifTransactions: IActivityTransaction[],
  btcTransactions: (IBitcoinTransaction & { sortTime: number })[],
): ActivityMixedType[] {
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
}
