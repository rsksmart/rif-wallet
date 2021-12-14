export const getTokenColor = (tokenName: string) => {
  switch (tokenName) {
    case 'TRBTC':
      return '#FFCC33'
    case 'tRIF Token':
      return '#ECF7FE'
    case 'Dollar on Chain':
      return '#c0face'
    default:
      return '#e1e1e1'
  }
}
