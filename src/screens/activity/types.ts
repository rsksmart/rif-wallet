import {
  IApiTransaction,
  TransactionsServerResponse,
} from '@rsksmart/rif-wallet-services'
import { EnhancedResult } from 'lib/abiEnhancer/AbiEnhancer'

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

export type ActivityRowPresentationObjectType = {
  symbol: string
  to: string
  timeHumanFormatted: string
  value: string
  status: 'success' | 'pending'
  id: string
}

export type ActivityRowPresentationType = ActivityRowPresentationObjectType & {
  onPress: () => void
}

export type ActivityMixedType = (IActivityTransaction | IBitcoinTransaction) & {
  id: string
}
