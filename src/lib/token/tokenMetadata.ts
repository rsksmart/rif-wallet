// @ts-ignore
import contractMapMainnet from '@rsksmart/rsk-contract-metadata'
// @ts-ignore
import contractMapTestNet from '@rsksmart/rsk-testnet-contract-metadata'
// @ts-ignore
import rbtcMainnet from './assets/RBTC-mainnet.svg'
// @ts-ignore
import rbtcTestnet from './assets/RBTC-testnet.svg'
// @ts-ignore
import tokenMainnet from './assets/token-mainnet.svg'
// @ts-ignore
import tokenTestnet from './assets/token-testnet.svg'

import { BaseToken } from './BaseToken'
import { ERC20Token } from './ERC20Token'
import { RBTCToken } from './RBTCToken'
import { Signer } from '@ethersproject/abstract-signer'

export interface ITokenMetadata {
  [address: string]: {
    name: string
    logo?: string
    erc20?: boolean
    symbol: string
    decimals: number
  }
}

export const MAINNET_CHAINID = 30

export const imagesUrlMainnet =
  'https://raw.githubusercontent.com/rsksmart/rsk-testnet-contract-metadata/master/images'

export const tokensMetadataMainnet = contractMapMainnet as ITokenMetadata

export const imagesUrlTestnet =
  'https://raw.githubusercontent.com/rsksmart/rsk-contract-metadata/master/images'

export const tokensMetadataTestnet = contractMapTestNet as ITokenMetadata

export const getTokenLogo = (address: string, chainId: number) => {
  const tokensMetadata =
    chainId === MAINNET_CHAINID ? tokensMetadataMainnet : tokensMetadataTestnet

  const imageBaseUrl =
    chainId === MAINNET_CHAINID ? imagesUrlMainnet : imagesUrlTestnet

  if (tokensMetadata[address] && tokensMetadata[address].logo) {
    return `${imageBaseUrl}/${tokensMetadata[address].logo}`
  }

  return chainId === MAINNET_CHAINID ? tokenMainnet : tokenTestnet
}

export const getAllTokens = async (signer: Signer): Promise<BaseToken[]> => {
  const chainId = await signer.getChainId()

  const metadataTokens =
    chainId === MAINNET_CHAINID ? tokensMetadataMainnet : tokensMetadataTestnet

  const metadataKeys = Object.keys(metadataTokens)

  const tokens: BaseToken[] = []

  const rbtcLogo = chainId === MAINNET_CHAINID ? rbtcMainnet : rbtcTestnet
  const rbtcSymbol = chainId === MAINNET_CHAINID ? 'RBTC' : 'TRBTC'
  const rbtc = new RBTCToken(signer, rbtcSymbol, rbtcLogo, chainId)

  tokens.push(rbtc)

  for (const address of metadataKeys) {
    const addressWithoutChecksum = address.toLowerCase()
    const symbol = metadataTokens[address].symbol
    const logo = getTokenLogo(addressWithoutChecksum, chainId)
    const token = new ERC20Token(addressWithoutChecksum, signer, symbol, logo)

    tokens.push(token)
  }

  return tokens
}

export const makeRBTCToken = (signer: Signer, chainId: number): RBTCToken => {
  const rbtcLogo = chainId === MAINNET_CHAINID ? rbtcMainnet : rbtcTestnet
  const rbtcSymbol = chainId === MAINNET_CHAINID ? 'RBTC' : 'TRBTC'
  const rbtc = new RBTCToken(signer, rbtcSymbol, rbtcLogo, chainId)

  return rbtc
}
