import {
  RIFWalletServicesFetcherInterface,
  IApiTransaction,
  ITokenWithBalance,
} from '@rsksmart/rif-wallet-services'
import { IAbiEnhancer, EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'

export interface IPrice {
  price: number
  lastUpdated: string
}

export interface NewTransactionsAction {
  type: 'newTransactions'
  payload: TransactionsServerResponseWithActivityTransactions
}

export interface IEvent {
  blockNumber: number
  event: string
  timestamp: number
  topics: Array<string>
  args: Array<string>
  transactionHash: string
  txStatus: string
}

export interface NewBalanceAction {
  type: 'newBalance'
  payload: ITokenWithBalance
}

export type Price = Record<string, { price: number; lastUpdated: string }>

export interface NewPriceAction {
  type: 'newPrice'
  payload: Price
}

export interface NewTransactionAction {
  type: 'newTransaction'
  payload: IApiTransaction
}

export interface NewTokenTransferAction {
  type: 'newTokenTransfer'
  payload: IEvent
}
export interface InitAction {
  type: 'init'
  payload: {
    transactions: IActivityTransaction[]
    balances: ITokenWithBalance[]
    prices: Price
  }
}

export interface ResetAction {
  type: 'reset'
}

export type Action =
  | NewTransactionsAction
  | NewBalanceAction
  | NewPriceAction
  | NewTransactionAction
  | NewTokenTransferAction
  | InitAction
  | ResetAction

export interface IActivityTransaction {
  originTransaction: IApiTransaction
  enhancedTransaction?: EnhancedResult
}

export type ActivityScreenProps = {
  fetcher: RIFWalletServicesFetcherInterface
  abiEnhancer: IAbiEnhancer
}

export interface TransactionsServerResponse {
  next: string | null | undefined
  prev: string | null | undefined
  data: IApiTransaction[]
}

export interface TransactionsServerResponseWithActivityTransactions
  extends TransactionsServerResponse {
  activityTransactions: IActivityTransaction[]
}
