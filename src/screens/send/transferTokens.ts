import { convertToERC20Token, makeRBTCToken } from '@rsksmart/rif-wallet-token'
import { BigNumber, ContractTransaction, utils } from 'ethers'
import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { TransactionInformation } from './TransactionInfo'
import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import {
  OnSetCurrentTransactionFunction,
  OnSetErrorFunction,
  OnSetTransactionStatusChange,
} from './types'

interface IRifTransfer {
  token: ITokenWithBalance
  amount: string
  to: string
  wallet: RIFWallet
  chainId: number
  onSetError?: OnSetErrorFunction
  onSetCurrentTransaction?: OnSetCurrentTransactionFunction
  onSetTransactionStatusChange?: OnSetTransactionStatusChange
}

export const transfer = ({
  to,
  amount,
  wallet,
  chainId,
  token,
  onSetError,
  onSetCurrentTransaction,
  onSetTransactionStatusChange,
}: IRifTransfer) => {
  if (onSetError) {
    onSetError(null)
  }
  if (onSetCurrentTransaction) {
    onSetCurrentTransaction({ status: 'USER_CONFIRM' })
  }

  // handle both ERC20 tokens and the native token (gas)
  const transferMethod =
    token.symbol === 'TRBTC'
      ? makeRBTCToken(wallet, chainId)
      : convertToERC20Token(token, {
          signer: wallet,
          chainId,
        })

  transferMethod.decimals().then((decimals: number) => {
    const tokenAmount = BigNumber.from(utils.parseUnits(amount, decimals))

    transferMethod
      .transfer(to.toLowerCase(), tokenAmount)
      .then((txPending: ContractTransaction) => {
        const { wait: waitForTransactionToComplete, ...txPendingRest } =
          txPending
        if (onSetTransactionStatusChange) {
          onSetTransactionStatusChange({
            txStatus: 'PENDING',
            ...txPendingRest,
            value: tokenAmount,
            symbol: transferMethod.symbol,
            finalAddress: to,
            enhancedAmount: amount,
          })
        }
        const current: TransactionInformation = {
          to,
          value: amount,
          symbol: transferMethod.symbol,
          hash: txPending.hash,
          status: 'PENDING',
        }
        if (onSetCurrentTransaction) {
          onSetCurrentTransaction(current)
        }

        waitForTransactionToComplete()
          .then(contractReceipt => {
            if (onSetCurrentTransaction) {
              onSetCurrentTransaction({ ...current, status: 'SUCCESS' })
            }
            if (onSetTransactionStatusChange) {
              onSetTransactionStatusChange({
                txStatus: 'CONFIRMED',
                ...contractReceipt,
              })
            }
          })
          .catch(() => {
            if (onSetCurrentTransaction) {
              onSetCurrentTransaction({ ...current, status: 'FAILED' })
            }
            if (onSetTransactionStatusChange) {
              onSetTransactionStatusChange({
                txStatus: 'FAILED',
                ...txPendingRest,
              })
            }
          })
      })
      .catch(err => {
        if (onSetError) {
          onSetError(err)
        }
        if (onSetCurrentTransaction) {
          onSetCurrentTransaction(null)
        }
      })
  })
}
