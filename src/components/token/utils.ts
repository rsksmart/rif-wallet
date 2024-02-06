import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'

import { ITokenWithoutLogo } from 'src/redux/slices/balancesSlice/types'
import { TokenSymbol } from 'src/screens/home/TokenImage'

export type TokenOrBitcoinNetwork = ITokenWithoutLogo | BitcoinNetwork

// default order should be RIF, USDRIF, RBTC, BTC and RDOC
// other tokens should be sorted alphabetically by symbol
export const sortTokensBySymbol = (
  a: TokenOrBitcoinNetwork,
  b: TokenOrBitcoinNetwork,
) => {
  const aSymbol = a.symbol.toUpperCase()
  const bSymbol = b.symbol.toUpperCase()
  if (
    aSymbol === TokenSymbol.RIF ||
    aSymbol === TokenSymbol.TRIF.toUpperCase()
  ) {
    return -1
  }
  if (
    bSymbol === TokenSymbol.RIF ||
    bSymbol === TokenSymbol.TRIF.toUpperCase()
  ) {
    return 1
  }
  if (aSymbol === TokenSymbol.USDRIF) {
    return -1
  }
  if (bSymbol === TokenSymbol.USDRIF) {
    return 1
  }
  if (aSymbol === TokenSymbol.RBTC || aSymbol === TokenSymbol.TRBTC) {
    return -1
  }
  if (bSymbol === TokenSymbol.RBTC || bSymbol === TokenSymbol.TRBTC) {
    return 1
  }
  if (aSymbol === TokenSymbol.BTC || aSymbol === TokenSymbol.BTCT) {
    return -1
  }
  if (bSymbol === TokenSymbol.BTC || bSymbol === TokenSymbol.BTCT) {
    return 1
  }
  if (aSymbol === TokenSymbol.RDOC.toUpperCase()) {
    return -1
  }
  if (bSymbol === TokenSymbol.RDOC.toUpperCase()) {
    return 1
  }
  if (aSymbol < bSymbol) {
    return -1
  }
  if (aSymbol > bSymbol) {
    return 1
  }
  return 0
}

// note that RDOC is not a default token
// which means it can be hidden if its balance is 0
export const isDefaultToken = (symbol: string) =>
  symbol === TokenSymbol.RIF ||
  symbol === TokenSymbol.TRIF ||
  symbol === TokenSymbol.USDRIF ||
  symbol === TokenSymbol.RBTC ||
  symbol === TokenSymbol.BTC
