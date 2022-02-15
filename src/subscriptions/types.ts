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

export interface NewPendingTransactionAction {
  type: 'newPendingTransaction'
  payload: any
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
export interface InitAction {
  type: 'init'
  payload: {
    transactions: IActivityTransaction[]
    balances: ITokenWithBalance[]
  }
}

export interface State {
  transactions: TransactionsServerResponseWithActivityTransactions
  balances: Record<string, ITokenWithBalance>
  prices: Record<string, IPrice>
  pendingTransactions: IActivityTransaction[]
}

export type Action =
  | NewTransactionsAction
  | NewPendingTransactionAction
  | NewBalanceAction
  | NewPriceAction
  | NewTransactionAction
  | InitAction

export type Dispatch = (action: Action) => void
export type SubscriptionsProviderProps = {
  children: React.ReactNode
  rifServiceSocket?: IRifWalletServicesSocket
  abiEnhancer: IAbiEnhancer
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
