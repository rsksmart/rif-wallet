export const getTokenColor = (tokenSymbol?: string): string => {
  switch (tokenSymbol) {
    case 'TRBTC':
      return '#3d8af7'
    case 'rDOC':
    case 'tRIF':
      return '#019cd8'
    case 'DOC':
      return '#00a845'
    default:
      return '#535D92'
  }
}

// Reference: https://stackoverflow.com/a/66143374/2218156
export const setOpacity = (hex: string, alpha: number) =>
  `${hex}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`

export const getTokenColorWithOpacity = (symbol: string, opacity: number) =>
  setOpacity(getTokenColor(symbol), opacity)
