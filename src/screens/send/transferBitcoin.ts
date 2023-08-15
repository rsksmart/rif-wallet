import {
  BIPWithRequest,
  convertBtcToSatoshi,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'

import { TokenSymbol } from 'screens/home/TokenImage'

import { OnSetCurrentTransactionFunction, OnSetErrorFunction } from './types'

interface ITransferBitcoin {
  bip: BIPWithRequest
  btcToPay: number
  to: string
  utxos: Array<UnspentTransactionType>
  balance: number
  addressToReturnRemainingAmount: string
  onBitcoinTransactionSuccess?: (options: { addressUsed: string }) => void
  onSetError?: OnSetErrorFunction
  onSetCurrentTransaction?: OnSetCurrentTransactionFunction
}

const MINIMUM_FEE = 141 // should be removed when estimate fee is up...

export const transferBitcoin = ({
  btcToPay,
  onSetError,
  onSetCurrentTransaction,
  bip,
  to,
  utxos,
  balance,
  addressToReturnRemainingAmount,
  onBitcoinTransactionSuccess,
}: ITransferBitcoin) => {
  if (onSetError) {
    onSetError(null)
  }
  if (onSetCurrentTransaction) {
    onSetCurrentTransaction({ status: 'USER_CONFIRM' })
  }
  const satoshisToPay = convertBtcToSatoshi(btcToPay.toString()).toNumber()

  bip.requestPayment
    .onRequestPayment({
      amountToPay: satoshisToPay,
      addressToPay: to,
      unspentTransactions: utxos,
      miningFee: Number(MINIMUM_FEE),
      balance,
      addressToReturnRemainingAmount,
    })
    .then(async txIdJson => {
      if (txIdJson.result) {
        // success
        if (onSetCurrentTransaction) {
          onBitcoinTransactionSuccess?.({
            addressUsed: addressToReturnRemainingAmount,
          })
          //@TODO: make the status a constant value
          onSetCurrentTransaction({
            status: 'PENDING',
            to,
            value: satoshisToPay.toString(),
            hash: txIdJson.result,
            symbol: TokenSymbol.BTC, // @TODO should use bitcoin symbol of current transaction
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
        onSetError(err.toString())
      }
      if (onSetCurrentTransaction) {
        onSetCurrentTransaction(null)
      }
    })
}
