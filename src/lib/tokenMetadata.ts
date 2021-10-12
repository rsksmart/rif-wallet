// @ts-ignore
import contractMapMainnet from '@rsksmart/rsk-contract-metadata'
// @ts-ignore
import contractMapTestNet from '@rsksmart/rsk-testnet-contract-metadata'

export interface ITokenMetadata {
  [address: string]: {
    name: string
    logo?: string
    erc20?: boolean
    symbol: string
    decimals: number
  }
}

export const imagesUrlMainnet =
  'https://raw.githubusercontent.com/rsksmart/rsk-testnet-contract-metadata/master/images'

export const tokensMetadataMainnet = contractMapMainnet as ITokenMetadata

export const imagesUrlTestnet =
  'https://raw.githubusercontent.com/rsksmart/rsk-contract-metadata/master/images'

export const tokensMetadataTestnet = contractMapTestNet as ITokenMetadata
