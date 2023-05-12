import { UnspentTransactionType } from '@rsksmart/rif-wallet-bitcoin'
import { BigNumber } from 'ethers'

import { BitcoinTokenBalanceObject } from 'store/slices/balancesSlice/types'

interface FetchUtxoFunction {
  token: BitcoinTokenBalanceObject
  onSetUtxos?: (data: UnspentTransactionType[]) => void
  onSetBalance?: (balance: BigNumber) => void
}

export const calculateBalanceFromUtxos = (
  utxos: UnspentTransactionType[],
): BigNumber =>
  utxos.reduce((prev, utxo) => {
    prev = prev.add(BigNumber.from(utxo.value))
    return prev
  }, BigNumber.from(0))

export const fetchUtxo = ({
  token,
  onSetUtxos,
  onSetBalance,
}: FetchUtxoFunction) => {
  token.bips[0].fetchUtxos().then((data: UnspentTransactionType[]) => {
    const filtered = data.filter(tx => tx.confirmations > 0) // Only confirmed unspent transactions
    if (onSetUtxos) {
      onSetUtxos(filtered)
    }
    // If onSetBalance calculate it and send it in the function
    if (onSetBalance) {
      onSetBalance(calculateBalanceFromUtxos(filtered))
    }
  })
}
