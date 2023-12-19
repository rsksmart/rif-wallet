import { convertToERC20Token, makeRBTCToken } from '@rsksmart/rif-wallet-token'
import { BigNumber, utils } from 'ethers'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'
import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { sanitizeMaxDecimalText } from 'lib/utils'

import {
  OnSetCurrentTransactionFunction,
  OnSetErrorFunction,
  OnSetTransactionStatusChange,
  TransactionInformation,
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

export const transfer = async ({
  to,
  amount,
  wallet,
  chainId,
  token,
  onSetError,
  onSetCurrentTransaction,
  onSetTransactionStatusChange,
}: IRifTransfer) => {
  onSetError?.(null)
  onSetCurrentTransaction?.({ status: 'USER_CONFIRM' })

  // handle both ERC20 tokens and the native token (gas)
  const transferMethod =
    token.symbol === 'RBTC'
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
      txStatus: 'PENDING',
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
      status: 'PENDING',
      original: txPendingRest,
    }
    onSetCurrentTransaction?.(current)

    const contractReceipt = await waitForTransactionToComplete()
    onSetCurrentTransaction?.({ ...current, status: 'SUCCESS' })
    onSetTransactionStatusChange?.({
      txStatus: 'CONFIRMED',
      original: {
        ...txPendingRest,
        hash: contractReceipt.transactionHash,
      },
      ...contractReceipt,
    })

    onSetCurrentTransaction?.({ ...current, status: 'FAILED' })
    onSetTransactionStatusChange?.({
      txStatus: 'FAILED',
      ...txPendingRest,
    })
  } catch (err) {
    onSetError?.(err as Error)
    onSetCurrentTransaction?.(null)
  }
}
