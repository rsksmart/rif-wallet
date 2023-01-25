import { BigNumber } from 'ethers'
import {
  BIPWithRequest,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'

import { OnSetCurrentTransactionFunction, OnSetErrorFunction } from './types'

interface ITransferBitcoin {
  bip: BIPWithRequest
  satoshisToPay: BigNumber
  to: string
  utxos: Array<UnspentTransactionType>
  onSetError?: OnSetErrorFunction
  onSetCurrentTransaction?: OnSetCurrentTransactionFunction
  balance: number
}

const MINIMUM_FEE = 141 // should be removed when estimate fee is up...

export const transferBitcoin = ({
  satoshisToPay,
  onSetError,
  onSetCurrentTransaction,
  bip,
  to,
  utxos,
  balance,
}: ITransferBitcoin) => {
  if (onSetError) {
    onSetError(null)
  }

  bip.requestPayment
    .onRequestPayment({
      amountToPay: Number(satoshisToPay),
      addressToPay: to,
      unspentTransactions: utxos,
      miningFee: Number(MINIMUM_FEE),
      balance,
    })
    .then(async txIdJson => {
      if (onSetCurrentTransaction) {
        onSetCurrentTransaction({ status: 'PENDING' })
      }
      if (txIdJson.result) {
        // success
        if (onSetCurrentTransaction) {
          onSetCurrentTransaction({
            status: 'SUCCESS',
            to,
            value: satoshisToPay.toString(),
            hash: txIdJson.result,
          })
        }
        // fetchUtxo() we should refresh Utxo
      } else {
        if (txIdJson.error) {
          if (onSetCurrentTransaction) {
            onSetCurrentTransaction({
              status: 'FAILED',
            })
          }
          if (onSetError) {
            onSetError(txIdJson.error)
          }
        }
      }
    })
    .catch(err => {
      if (onSetError) {
        onSetError({
          message: `Transaction cancelled: ${err.toString()}`,
        })
      }
    })
}
