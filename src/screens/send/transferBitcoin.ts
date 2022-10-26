import { BigNumber } from 'ethers'
import BIPWithRequest from '../../lib/bitcoin/BIPWithRequest'
import { convertSatoshiToBtcHuman } from '../../lib/bitcoin/utils'
import { UnspentTransactionType } from '../../lib/bitcoin/types'

interface ITransferBitcoin {
  bip: BIPWithRequest
  satoshisToPay: BigNumber
  to: string
  utxos: Array<UnspentTransactionType>
  onSetError?: (key: any) => void
  onSetCurrentTransaction?: (key: any) => void
  balance: number
}

export const validateAmount = (
  satoshisToPay: BigNumber,
  balanceAvailable: BigNumber,
): { isValid: boolean; message: string } => {
  if (satoshisToPay.gt(balanceAvailable)) {
    return {
      isValid: false,
      message: `Amount must not be greater than ${convertSatoshiToBtcHuman(
        balanceAvailable,
      )}`,
    }
  }
  if (satoshisToPay.lte(0)) {
    return {
      isValid: false,
      message: 'Amount must not be less or equal to 0',
    }
  }
  return {
    isValid: true,
    message: '',
  }
}

// const validateBitcoinTransfer = (satoshisToPay, balanceAvailable, addressToPay, bip) => {
//   if (satoshisToPay.gt(balanceAvailable)) {
//     setStatus(`Amount must not be greater than ${balanceAvailableHuman}`)
//     return
//   }
//   if (satoshisToPay.lte(0)) {
//     setStatus('Amount must not be less or equal to 0')
//     return
//   }
//   if (!isAddressValid(addressToPay, bip)) {
//     setStatus('Address is not valid. Please verify')
//     return
//   }
// }

const MINIMUM_FEE = 141

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
    onSetError(undefined)
  }
  if (onSetCurrentTransaction) {
    onSetCurrentTransaction({ status: 'USER_CONFIRM' })
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
      console.log(txIdJson)
      if (onSetCurrentTransaction) {
        onSetCurrentTransaction({ status: 'PENDING' })
      }
      if (txIdJson.result) {
        // success
        if (onSetCurrentTransaction) {
          onSetCurrentTransaction({
            status: 'SUCCESS',
            to,
            value: satoshisToPay,
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
        onSetError(`Transaction cancelled: ${err.toString()}`)
      }
    })
}
