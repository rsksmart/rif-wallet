import { convertToERC20Token, makeRBTCToken } from '@rsksmart/rif-wallet-token'
import { BigNumber, utils } from 'ethers'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'
import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { sanitizeMaxDecimalText } from 'lib/utils'

import { TransactionInformation } from 'store/slices/transactionsSlice'

import {
  OnSetCurrentTransactionFunction,
  OnSetErrorFunction,
  OnSetTransactionStatusChange,
} from './types'
import { TransactionStatus } from '../transactionSummary/types'

interface IRifTransfer {
  token: ITokenWithBalance
  amount: string
  to: string
  wallet: RIFWallet
  chainId: number
  feeToken?: ITokenWithBalance
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
  feeToken,
  onSetError,
  onSetCurrentTransaction,
  onSetTransactionStatusChange,
}: IRifTransfer) => {
  onSetError?.(null)
  onSetCurrentTransaction?.({
    status: TransactionStatus.USER_CONFIRM,
    feeSymbol: feeToken?.symbol,
  })

  // handle both ERC20 tokens and the native token (gas)
  const transferMethod =
    token.symbol === 'RBTC'
      ? makeRBTCToken(wallet, chainId)
      : convertToERC20Token(token, {
          signer: wallet,
          chainId,
        })

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
    })
    const current: TransactionInformation = {
      to,
      value: amount,
      symbol: transferMethod.symbol,
      hash: txPending.hash,
      status: TransactionStatus.PENDING,
      feeSymbol: feeToken?.symbol,
    }
    onSetCurrentTransaction?.(current)

    const contractReceipt = await waitForTransactionToComplete()
    onSetCurrentTransaction?.({ ...current, status: TransactionStatus.SUCCESS })
    onSetTransactionStatusChange?.({
      txStatus: 'CONFIRMED',
      ...contractReceipt,
    })

    onSetCurrentTransaction?.({ ...current, status: TransactionStatus.FAILED })
    onSetTransactionStatusChange?.({
      txStatus: 'FAILED',
      ...txPendingRest,
    })
  } catch (err) {
    onSetError?.(err as Error)
    onSetCurrentTransaction?.(null)
  }
}
