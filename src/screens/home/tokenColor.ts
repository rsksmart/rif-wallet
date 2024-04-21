import { sharedColors, tokenColors } from 'shared/constants'

export const getTokenColor = (tokenSymbol: string): string => {
  switch (tokenSymbol.toUpperCase()) {
    case 'TRBTC':
    case 'RBTC':
      return tokenColors.rbtc
    case 'RDOC':
    case 'DOC':
      return tokenColors.rdoc
    case 'TRIF':
    case 'RIF':
      return tokenColors.rif
    case 'BTC':
    case 'BTCT':
      return tokenColors.btc
    default:
      return sharedColors.background.highlight
  }
}

// Reference: https://stackoverflow.com/a/66143374/2218156
export const setOpacity = (hex: string, alpha: number) =>
  `${hex}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`

export const getTokenColorWithOpacity = (symbol: string, opacity: number) =>
  setOpacity(getTokenColor(symbol), opacity)
