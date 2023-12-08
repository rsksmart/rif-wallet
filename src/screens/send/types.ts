import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ContractReceipt } from 'ethers'
import {
  BitcoinNetwork,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'

import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { TransactionExtras } from 'store/slices/transactionsSlice/types'

export interface TransactionInformation {
  status: 'USER_CONFIRM' | 'PENDING' | 'SUCCESS' | 'FAILED'
  to?: string
  value?: string
  symbol?: string
  hash?: string
  original?: object
}

export type OnSetErrorFunction = (
  error: string | null | { message: string },
) => void

export type OnSetCurrentTransactionFunction = (
  object: TransactionInformation | null,
) => void

export type TransactionResponseWithoutWait = Omit<TransactionResponse, 'wait'>

export type OnSetTransactionStatusChange = (
  transaction: TransferTransactionStatus,
) => void

export interface IAssetChooser<T = unknown> {
  selectedAsset: T & IAsset
  assetList: Array<T & IAsset>
  onAssetSelected: (selectedAsset: T) => void
}

export interface IAsset {
  symbol: string
  balance: string | number
  decimals: number
}

export interface ITransfer {
  token: ITokenWithBalance | BitcoinNetwork
  amount: string
  to: string
  utxos?: Array<UnspentTransactionType>
}

export type MixedTokenAndNetworkType = BitcoinNetwork | ITokenWithoutLogo

type TransferTransactionStatus =
  | TransferTransactionStatusPending
  | TransferTransactionStatusConfirmed
  | TransferTransactionStatusFailed

type TransferTransactionStatusPending = {
  txStatus: 'PENDING'
} & TransactionExtras &
  TransactionResponseWithoutWait

type TransferTransactionStatusConfirmed = {
  txStatus: 'CONFIRMED'
  original?: object
} & ContractReceipt

type TransferTransactionStatusFailed = {
  txStatus: 'FAILED'
} & TransactionResponseWithoutWait
