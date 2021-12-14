export const getTokenColor = (tokenName: string) => {
  switch (tokenName) {
    case 'TRBTC':
      return '#3d8af7'
    case 'tRIF Token':
      return '#019cd8'
    case 'Dollar on Chain':
      return '#00a845'
    default:
      return '#CCCCCC'
  }
}

// Reference: https://stackoverflow.com/a/66143374/2218156
export const setOpacity = (hex: string, alpha: number) =>
  `${hex}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`

export const getTokenColorWithOpacity = (tokenName: string, opacity: number) =>
  setOpacity(getTokenColor(tokenName), opacity)
