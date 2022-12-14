import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import { UnspentTransactionType } from 'lib/bitcoin/types'
import { TransactionInformation } from './TransactionInfo'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { ContractReceipt } from 'ethers'

export type OnSetErrorFunction = (
  error: string | null | { message: string },
) => void

export type OnSetCurrentTransactionFunction = (
  object: TransactionInformation | null,
) => void

type TransactionResponseWithoutWait = Omit<TransactionResponse, 'wait'>
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
} & TransactionResponseWithoutWait

type TransferTransactionStatusConfirmed = {
  txStatus: 'CONFIRMED'
} & ContractReceipt

type TransferTransactionStatusFailed = {
  txStatus: 'FAILED'
} & TransactionResponseWithoutWait
