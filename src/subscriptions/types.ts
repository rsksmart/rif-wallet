import { IApiTransaction } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import { IRIFWalletServicesFetcher } from 'lib/rifWalletServices/RifWalletServicesFetcher'
import { IAbiEnhancer, IEnhancedResult } from 'lib/abiEnhancer/AbiEnhancer'
import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import { RIFWallet } from 'lib/core'

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

export interface NewPriceAction {
  type: 'newPrice'
  payload: Record<string, { price: number; lastUpdated: string }>
}

export interface NewTransactionAction {
  type: 'newTransaction'
  payload: IActivityTransaction
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
  enhancedTransaction?: IEnhancedResult
}

export type ActivityScreenProps = {
  fetcher: IRIFWalletServicesFetcher
  abiEnhancer: IAbiEnhancer
}

export interface TransactionsServerResponse {
  next: string | null | undefined
  prev: string | null | undefined
}

export interface TransactionsServerResponseWithActivityTransactions
  extends TransactionsServerResponse {
  activityTransactions: IActivityTransaction[]
}

export interface ISocketsChangeEmitted {
  abiEnhancer: IAbiEnhancer
  wallet: RIFWallet
}
