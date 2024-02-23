import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'
import {
  IApiTransaction,
  TransactionsServerResponse,
} from '@rsksmart/rif-wallet-services'

import { TokenSymbol } from 'screens/home/TokenImage'
import { TransactionStatus } from 'screens/transactionSummary/transactionSummaryUtils'
import { IEvent } from 'src/subscriptions/types'

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
  isBitcoin: boolean
  id: string
  sortTime: number
  amIReceiver: boolean
  from?: string
}

export interface TokenFeeValueObject {
  tokenValue: string
  usdValue: number | string
  symbol?: TokenSymbol | string
}

export interface ActivityRowPresentationObject {
  id: string
  to: string
  status: TransactionStatus
  value: string
  symbol: string
  price: number
  fee: TokenFeeValueObject
  timeHumanFormatted: string
  amIReceiver?: boolean
  from?: string
  timestamp: number
  original?: IApiTransaction
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
