import {
  IApiTransaction,
  TransactionsServerResponse,
} from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { IEnhancedResult } from '../../lib/abiEnhancer/AbiEnhancer'

export interface TransactionsServerResponseWithActivityTransactions
  extends TransactionsServerResponse {
  activityTransactions?: IActivityTransaction[]
}

export interface IActivityTransaction {
  originTransaction: IApiTransaction
  enhancedTransaction?: IEnhancedResult
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

export type ActivityRowPresentationType = {
  symbol: string
  to: string
  timeHumanFormatted: string
  value: string
  status: 'success' | 'pending'
  id: string
}

export type ActivityMixedType = (IActivityTransaction | IBitcoinTransaction) & {
  id: string
}
