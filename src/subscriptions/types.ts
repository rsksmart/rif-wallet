import React from 'react'
import { IApiTransaction } from '../lib/rifWalletServices/RIFWalletServicesTypes'
import { IRIFWalletServicesFetcher } from '../lib/rifWalletServices/RifWalletServicesFetcher'
import { IAbiEnhancer, IEnhancedResult } from '../lib/abiEnhancer/AbiEnhancer'
import { ITokenWithBalance } from '../lib/rifWalletServices/RIFWalletServicesTypes'
import { IRifWalletServicesSocket } from '../lib/rifWalletServices/RifWalletServicesSocket'

export interface IActivity
  extends TransactionsServerResponseWithActivityTransactions {}

export interface IPrice {
  price: number
  lastUpdated: string
}

export interface NewTransactionsAction {
  type: 'newTransactions'
  payload: IActivity
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

export interface State {
  transactions: TransactionsServerResponseWithActivityTransactions
  balances: Record<string, ITokenWithBalance>
  prices: Record<string, IPrice>
  events: Array<IEvent>
  isSetup: Boolean
}

export type Action =
  | NewTransactionsAction
  | NewBalanceAction
  | NewPriceAction
  | NewTransactionAction
  | NewTokenTransferAction
  | InitAction
  | ResetAction

export type Dispatch = (action: Action) => void
export type SubscriptionsProviderProps = {
  children: React.ReactNode
  rifServiceSocket?: IRifWalletServicesSocket
  abiEnhancer: IAbiEnhancer
  appActive: boolean
}

export interface IActivityTransaction {
  originTransaction: IApiTransaction
  enhancedTransaction?: IEnhancedResult
}

export type ActivityScreenProps = {
  fetcher: IRIFWalletServicesFetcher
  abiEnhancer: IAbiEnhancer
}

export interface FetchTransactionsOptions {
  next: string | null
  prev: string | null
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
