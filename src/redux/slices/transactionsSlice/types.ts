import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'
import {
  IApiTransaction,
  TransactionsServerResponse,
} from '@rsksmart/rif-wallet-services'

import { IEvent } from 'src/subscriptions/types'
import { TransactionStatus } from 'screens/transactionSummary/transactionSummaryUtils'

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
  amIReceiver: boolean
  from?: string
}

export interface TokenFeeValueObject {
  tokenValue: string
  usdValue: string
}

export interface ActivityRowPresentationObject {
  symbol: string
  to: string
  timeHumanFormatted: string
  value: string
  status: TransactionStatus
  id: string
  price: number
  fee: TokenFeeValueObject
  total: TokenFeeValueObject
  amIReceiver?: boolean
  from?: string
  timestamp: number
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
export type ModifyTransaction = Partial<IApiTransaction> &
  Pick<IApiTransaction, 'hash'>
