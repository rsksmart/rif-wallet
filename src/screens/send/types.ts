import { TransactionResponse } from '@ethersproject/abstract-provider'
import {
  BitcoinNetwork,
  UnspentTransactionType,
} from '@rsksmart/rif-wallet-bitcoin'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'

import { TransactionStatus } from 'store/shared/types'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

export type TransactionResponseWithoutWait = Omit<TransactionResponse, 'wait'>

export interface TransactionInformation {
  status: TransactionStatus
  to?: string
  value?: string
  symbol?: string
  hash?: string
  original?: TransactionResponseWithoutWait
}

export type OnSetErrorFunction = (
  error: string | null | { message: string },
) => void

export type OnSetCurrentTransactionFunction = (
  object: TransactionInformation | null,
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
