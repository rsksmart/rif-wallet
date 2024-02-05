import { IApiTransaction } from '@rsksmart/rif-wallet-services'
import { ContractReceipt } from 'ethers'

import { TransactionResponseWithoutWait } from 'screens/send/types'

import { ActivityRowPresentationObject } from '../slices/transactionsSlice'

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  USER_CONFIRM = 'USER_CONFIRM',
}

export interface TransactionExtras {
  symbol?: string
  finalAddress?: string
  enhancedAmount?: string
  original?: TransactionResponseWithoutWait
}

type TransferTransactionStatus =
  | TransferTransactionStatusPending
  | TransferTransactionStatusConfirmed
  | TransferTransactionStatusFailed

type TransferTransactionStatusPending = {
  txStatus: TransactionStatus.PENDING
} & TransactionExtras &
  TransactionResponseWithoutWait

type TransferTransactionStatusConfirmed = {
  txStatus: TransactionStatus.USER_CONFIRM
  original?: TransactionResponseWithoutWait
} & ContractReceipt

type TransferTransactionStatusFailed = {
  txStatus: TransactionStatus.FAILED
} & TransactionResponseWithoutWait

export type OnSetTransactionStatusChange = (
  transaction: TransferTransactionStatus,
) => void

export type ApiTransactionWithExtras = IApiTransaction & TransactionExtras
export type ModifyTransaction = Partial<IApiTransaction> &
  Pick<IApiTransaction, 'hash'> &
  Pick<ActivityRowPresentationObject, 'status'>
