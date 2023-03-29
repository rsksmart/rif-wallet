import {
  BitcoinNetwork,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber } from 'ethers'

export const useBitcoinFetchUtxoBalance = (
  token: BitcoinNetwork | undefined,
) => {
  const [utxos, setUtxos] = useState<UnspentTransactionType[]>([])
  const fetchUtxo = useCallback(async () => {
    token?.bips[0].fetchUtxos().then((data: Array<UnspentTransactionType>) => {
      const filtered = data.filter(tx => tx.confirmations > 0)
      setUtxos(filtered)
    })
  }, [token])

  const balanceAvailable = useMemo(
    () =>
      utxos
        .reduce((prev, utxo) => {
          prev = prev.add(BigNumber.from(utxo.value))
          return prev
        }, BigNumber.from(0))
        .toNumber(),
    [utxos],
  )

  // When function fetchUtxo changes - fetch utxo
  useEffect(() => {
    fetchUtxo()
  }, [fetchUtxo])

  return { utxos, balanceAvailable }
}
