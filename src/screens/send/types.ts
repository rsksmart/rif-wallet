import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { UnspentTransactionType } from '../../lib/bitcoin/types'
import { TransactionInformation } from './TransactionInfo'

export type OnSetErrorFunction = (
  error: string | null | { message: string },
) => void

export type OnSetCurrentTransactionFunction = (
  object: TransactionInformation | null,
) => void

export interface IAssetChooser {
  selectedAsset: IAsset
  assetList: Array<IAsset>
  onAssetSelected: (selectedAsset: IAsset) => void
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

export type MixedTokenAndNetworkType = BitcoinNetwork & ITokenWithBalance
