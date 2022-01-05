import React from 'react'
import {
  IApiTransaction,
  TransactionsServerResponse,
} from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { IRIFWalletServicesFetcher } from '../../lib/rifWalletServices/RifWalletServicesFetcher'
import {
  IAbiEnhancer,
  IEnhancedResult,
} from '../../lib/abiEnhancer/AbiEnhancer'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'


export interface IActivity
  extends TransactionsServerResponseWithActivityTransactions {}
export interface ITransaction {
  _id: string
  hash: string
  nonce: number
  blockHash: string
  blockNumber: number
  transactionIndex: string
  from: string
  to: string
  gas: number
  gasPrice: string
  value: string
  input: string
  v: string
  r: string
  s: string
  timestamp: number
  receipt: {
    transactionHash: string
    transactionIndex: number
    blockHash: string
    blockNumber: number
    cumulativeGasUsed: string
    gasUsed: number
    contractAddress: any
    logs: Array<any>
    from: string
    to: string
    status: string
    logsBloom: string
  }
  txType: string
  txId: string
}

export interface IPrice {
  price: number
  lastUpdated: string
}


export interface NewActivityAction {
  type: 'newActivity'
  payload: IActivity | null
}

export interface NewBlanceAction {
  type: 'newBalance'
  payload: ITokenWithBalance
}

export interface NewPriceAction {
  type: 'newPrice'
  payload: Record<string, { price: number; lastUpdated: string }>
}

export interface NewTransactionAction {
  type: 'newTransaction'
  payload: ITransaction
}

export interface State {
  activities: TransactionsServerResponseWithActivityTransactions | null
  balances: Record<string, ITokenWithBalance>
  prices: Record<string, IPrice>
  transactions: Array<ITransaction>
}

export type Action =
  | NewActivityAction
  | NewBlanceAction
  | NewPriceAction
  | NewTransactionAction
export type Dispatch = (action: Action) => void
export type LoadRBTCBalance = () => void
export type SubscriptionsProviderProps = { children: React.ReactNode }

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

export interface TransactionsServerResponseWithActivityTransactions
  extends TransactionsServerResponse {
  activityTransactions?: IActivityTransaction[]
}
