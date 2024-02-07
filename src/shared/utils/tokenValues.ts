import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'

import { TokenSymbol } from 'screens/home/TokenImage'
import { ChainID } from 'src/lib/eoaWallet'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

const defaultMainnetTokens: ITokenWithoutLogo[] = Object.keys(mainnetContracts)
  .filter(address =>
    ['RIF', 'USDRIF', ''].includes(mainnetContracts[address].symbol),
  )
  .map(address => {
    const { decimals, name, symbol } = mainnetContracts[address]
    return {
      decimals,
      name,
      symbol,
      contractAddress: address.toLowerCase(),
      balance: '0x00',
      usdBalance: 0,
    }
  })
const defaultTestnetTokens: ITokenWithoutLogo[] = Object.keys(testnetContracts)
  .filter(address =>
    ['tRIF', 'USDRIF'].includes(testnetContracts[address].symbol),
  )
  .map(address => {
    const { decimals, name, symbol } = testnetContracts[address]
    return {
      decimals,
      name,
      symbol,
      contractAddress: address.toLowerCase(),
      balance: '0x00',
      usdBalance: 0,
    }
  })
export const getDefaultTokens = (chainId: ChainID) => {
  return chainId === 30 ? defaultMainnetTokens : defaultTestnetTokens
}

export const RBTCToken: ITokenWithoutLogo = {
  balance: '0x00',
  contractAddress: '0x0000000000000000000000000000000000000000',
  decimals: 18,
  name: 'RBTC',
  symbol: 'RBTC',
  usdBalance: 0,
}

export const getAllowedFees = (chainId: ChainID) => {
  const defaultTokens = getDefaultTokens(chainId).filter(
    t => t.symbol !== TokenSymbol.USDRIF,
  )

  defaultTokens.push(RBTCToken)

  console.log('defaultTokens inALLOWED FEES', defaultTokens)

  return defaultTokens.map(dt => dt.contractAddress)
}

export const getDefaultFeeEOA = () => RBTCToken
export const getDefaultFeeRelay = (chainId: ChainID) =>
  getDefaultTokens(chainId)[0]

export const allowedFeesEOA = new Map([
  [true, TokenSymbol.RBTC],
  [false, TokenSymbol.TRBTC],
])

export const allowedFeesRelay = new Map([
  [true, TokenSymbol.RIF],
  [false, TokenSymbol.TRIF],
])

export const allowedBitcoinFees = new Map([
  [true, TokenSymbol.BTC],
  [true, TokenSymbol.BTCT],
])

// // this needs to be here because of the failing tests
// enum TokenSymbol {
//   TRBTC = 'TRBTC',
//   RBTC = 'RBTC',
// }

export const bitcoinFeeMap = new Map([
  [TokenSymbol.BTC, true],
  [TokenSymbol.BTCT, true],
])

export const rbtcMap = new Map([
  [TokenSymbol.TRBTC, true],
  [TokenSymbol.RBTC, true],
  [undefined, false],
])

export const getFeeSymbol = (isMainnet: boolean, isRelayWallet: boolean) => {
  switch (isMainnet) {
    case false:
      return !isRelayWallet ? TokenSymbol.TRBTC : TokenSymbol.TRIF

    case true:
      return !isRelayWallet ? TokenSymbol.RBTC : TokenSymbol.RIF
  }
}

const tiniestAmount = 0.000001

const formatWithDigits = (number: string) => {
  const splitArr = number.split('.')
  const secondPart =
    splitArr[1].length > 8 ? splitArr[1].slice(0, 9) : splitArr[1]

  return [splitArr[0], secondPart].join('.')
}

export const formatSmallNumbers = (smallNumber: string | number) => {
  if (isNaN(Number(smallNumber))) {
    return smallNumber.toString()
  }

  smallNumber = smallNumber.toString()
  const asNumber = Number(smallNumber)

  if (asNumber >= tiniestAmount) {
    return formatWithDigits(smallNumber)
  }

  return asNumber !== 0 ? `< ${tiniestAmount}` : '0.00'
}

export const formatTokenValues = (number: string | number) => {
  // make sure to use this only at the end when showing values
  if (isNaN(Number(number))) {
    return number.toString()
  }
  number = number.toString()
  const asNumber = Number(number)

  if (asNumber < 1) {
    return formatSmallNumbers(number)
  }

  if (number.includes('.') && asNumber > 1) {
    return formatWithDigits(number)
  }

  if (number.length <= 3) {
    return number
  }

  const longNumberArr = number.split('')

  for (let i = number.length - 3; i > 0; i -= 3) {
    longNumberArr.splice(i, 0, ',')
  }

  return longNumberArr.join('')
}

export const getFormattedTokenValue = (tokenValue: string) => {
  if (!tokenValue.includes('.')) {
    return tokenValue
  }
  const tokenValueArr = tokenValue.split('.')
  const decimals = tokenValueArr[1].length

  if (decimals < 8) {
    return tokenValue
  }

  const restDecimals = tokenValueArr[1].split('').slice(7, decimals)

  let moreThanZeroIndex = 0

  for (let i = 0; i < restDecimals.length; i++) {
    if (Number(restDecimals[i]) > 0) {
      moreThanZeroIndex = i
      break
    }
  }

  const hasOneMoreDigit = !!restDecimals[moreThanZeroIndex + 1]
  const lastAfterZero = restDecimals.slice(
    0,
    hasOneMoreDigit ? moreThanZeroIndex + 2 : moreThanZeroIndex + 1,
  )
  const ending = restDecimals[moreThanZeroIndex + 2] ? '...' : ''

  return (
    tokenValueArr[0] +
    '.' +
    tokenValueArr[1].slice(0, 7).concat(...lastAfterZero) +
    ending
  )
}
