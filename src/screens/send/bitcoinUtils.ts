import { UnspentTransactionType } from '@rsksmart/rif-wallet-bitcoin'
import { BigNumber } from 'ethers'

import { BitcoinTokenBalanceObject } from 'store/slices/balancesSlice/types'

interface FetchUtxoFunction {
  token: BitcoinTokenBalanceObject
  onSetUtxos?: (data: UnspentTransactionType[]) => void
  onSetBalance?: (balance: BigNumber) => void
}

interface FetchAddressToReturnFundsToFunction {
  token: BitcoinTokenBalanceObject
  usedBitcoinAddresses: { [key: string]: string }
  onSetAddress?: (address: string) => void
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
  if (token.bips[0].fetchUtxos) {
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
}

export const fetchAddressToReturnFundsTo = ({
  token,
  onSetAddress,
  usedBitcoinAddresses,
}: FetchAddressToReturnFundsToFunction) => {
  token.bips[0].fetchExternalAvailableAddresses({}).then(addresses => {
    for (const address of addresses) {
      if (!usedBitcoinAddresses[address]) {
        onSetAddress?.(address)
        break
      }
    }
  })
}
