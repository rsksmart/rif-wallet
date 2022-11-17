import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { UnspentTransactionType } from '../../lib/bitcoin/types'

export interface IAssetChooser {
  selectedAsset: IAsset
  assetList: Array<IAsset>
  onAssetSelected: (selectedAsset: any) => void
}

export interface IAsset {
  symbol: string
  balance: string | number
  decimals: number
  [key: string]: any
}

export interface ITransfer {
  token: ITokenWithBalance | BitcoinNetwork
  amount: string
  to: string
  utxos?: Array<UnspentTransactionType>
}

export type MixedTokenAndNetworkType = BitcoinNetwork | ITokenWithBalance
