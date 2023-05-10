import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'
import {
  IApiTransaction,
  TransactionsServerResponse,
} from '@rsksmart/rif-wallet-services'

import { IEvent } from 'src/subscriptions/types'

export enum TransactionStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
}

export interface TransactionsServerResponseWithActivityTransactions
  extends TransactionsServerResponse {
  activityTransactions?: IActivityTransaction[]
}

export interface IActivityTransaction {
  originTransaction: IApiTransaction
  enhancedTransaction?: EnhancedResult
}

export interface IBitcoinTransaction {
  txid: string
  value: string
  valueBtc: string
  to: string
  symbol: string
  blockTime: number
  status: 'success' | 'pending'
  isBitcoin: true
  id: string
  sortTime: number
}

export interface ActivityRowPresentationObject {
  symbol: string
  to: string
  timeHumanFormatted: string
  value: string
  status: TransactionStatus
  id: string
  price: number
  fee: string
  total: string
}

export type ActivityRowPresentationType = ActivityRowPresentationObject & {
  onPress: () => void
}

export type ActivityMixedType = IActivityTransaction | IBitcoinTransaction

export interface TransactionsState {
  prev: string | null
  next: string | null
  transactions: ActivityRowPresentationObject[]
  events: IEvent[]
  loading: boolean
}

export interface TransactionExtras {
  symbol?: string
  finalAddress?: string
  enhancedAmount?: string
}

export type ApiTransactionWithExtras = IApiTransaction & TransactionExtras
export type ModifyTransactionAction = Partial<IApiTransaction> &
  Pick<IApiTransaction, 'hash'>
