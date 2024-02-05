import { convertToERC20Token, makeRBTCToken } from '@rsksmart/rif-wallet-token'
import { BigNumber, utils } from 'ethers'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'

import { sanitizeMaxDecimalText } from 'lib/utils'

import { Wallet } from 'shared/wallet'
import {
  OnSetTransactionStatusChange,
  TransactionStatus,
} from 'store/shared/types'

import {
  OnSetCurrentTransactionFunction,
  OnSetErrorFunction,
  TransactionInformation,
} from './types'
import { TokenSymbol } from '../home/TokenImage'

interface RifTransfer {
  token: ITokenWithBalance
  amount: string
  to: string
  wallet: Wallet
  chainId: number
  onSetError?: OnSetErrorFunction
  onSetCurrentTransaction?: OnSetCurrentTransactionFunction
  onSetTransactionStatusChange?: OnSetTransactionStatusChange
}

export const transfer = async ({
  to,
  amount,
  wallet,
  chainId,
  token,
  onSetError,
  onSetCurrentTransaction,
  onSetTransactionStatusChange,
}: RifTransfer) => {
  onSetError?.(null)
  onSetCurrentTransaction?.({ status: TransactionStatus.USER_CONFIRM })

  // handle both ERC20 tokens and the native token (gas)
  const transferMethod =
    token.symbol === TokenSymbol.RBTC
      ? makeRBTCToken(wallet, chainId)
      : convertToERC20Token(token, wallet)

  try {
    const decimals = await transferMethod.decimals()
    const tokenAmount = BigNumber.from(
      utils.parseUnits(sanitizeMaxDecimalText(amount, decimals), decimals),
    )
    const txPending = await transferMethod.transfer(
      to.toLowerCase(),
      tokenAmount,
    )

    const { wait: waitForTransactionToComplete, ...txPendingRest } = txPending
    onSetTransactionStatusChange?.({
      txStatus: TransactionStatus.PENDING,
      ...txPendingRest,
      value: tokenAmount,
      symbol: transferMethod.symbol,
      finalAddress: to,
      enhancedAmount: amount,
      original: txPendingRest,
    })
    const current: TransactionInformation = {
      to,
      value: amount,
      symbol: transferMethod.symbol,
      hash: txPending.hash,
      status: TransactionStatus.PENDING,
      original: txPendingRest,
    }
    onSetCurrentTransaction?.(current)

    waitForTransactionToComplete()
      .then(contractReceipt => {
        onSetCurrentTransaction?.({
          ...current,
          status: TransactionStatus.SUCCESS,
        })
        onSetTransactionStatusChange?.({
          txStatus: TransactionStatus.USER_CONFIRM,
          original: {
            ...txPendingRest,
            hash: contractReceipt.transactionHash,
          },
          ...contractReceipt,
        })
      })
      .catch(() => {
        onSetCurrentTransaction?.({
          ...current,
          status: TransactionStatus.FAILED,
        })
        onSetTransactionStatusChange?.({
          txStatus: TransactionStatus.FAILED,
          ...txPendingRest,
        })
      })
  } catch (err) {
    onSetError?.(err as Error)
    onSetCurrentTransaction?.(null)
  }
}
