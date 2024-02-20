import { ChainID } from 'lib/eoaWallet'

import { TokenSymbol, getTokenByChainId } from 'screens/home/TokenImage'
import { TokenOrBitcoinNetwork } from 'shared/types'

/**
 * Sorts balances by symbol in the following order:
 * RIF, USDRIF, RBTC, BTC, RDOC and then alphabetically by symbol
 * @param balances - array of balances
 * @param chainId - chain id (30 or 31)
 * @returns sorted array of balances
 */
export const sortBalancesBySymbol = (
  balances: Array<TokenOrBitcoinNetwork>,
  chainId: ChainID,
): Array<TokenOrBitcoinNetwork> => {
  const rif = getTokenByChainId(TokenSymbol.RIF, chainId)
  const usdrif = getTokenByChainId(TokenSymbol.USDRIF, chainId)
  const rbtc = getTokenByChainId(TokenSymbol.RBTC, chainId)
  const btc = getTokenByChainId(TokenSymbol.BTC, chainId)
  const rdoc = getTokenByChainId(TokenSymbol.RDOC, chainId)

  const defaultOrder = [rif, usdrif, rbtc, btc, rdoc]

  return balances.sort((a, b) => {
    const symbolA = getTokenByChainId(a.symbol, chainId)
    const symbolB = getTokenByChainId(b.symbol, chainId)
    const indexA = defaultOrder.indexOf(symbolA)
    const indexB = defaultOrder.indexOf(symbolB)

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    if (indexA !== -1) {
      return -1
    }
    if (indexB !== -1) {
      return 1
    }
    if (symbolA < symbolB) {
      return -1
    }
    if (symbolA > symbolB) {
      return 1
    }
    return 0
  })
}
