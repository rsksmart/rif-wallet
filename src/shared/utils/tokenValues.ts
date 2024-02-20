import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'

import { ChainID } from 'lib/eoaWallet'

import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

import { isRelayWallet } from './wallet'

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

  return defaultTokens
}

export const getDefaultFeeEOA = () => RBTCToken
export const getDefaultFeeRelay = (chainId: ChainID) =>
  getDefaultTokens(chainId)[0]

export const getDefaultTokenContract = (chainId: ChainID) =>
  isRelayWallet
    ? getDefaultFeeRelay(chainId).contractAddress
    : getDefaultFeeEOA().contractAddress

export const getFee = (chainId: ChainID, address?: string) => {
  switch (isRelayWallet) {
    case true:
      const allowedToken = getAllowedFees(chainId).find(
        fee => fee.contractAddress.toLowerCase() === address?.toLowerCase(),
      )

      return !allowedToken ? getDefaultFeeRelay(chainId) : allowedToken
    case false:
      return getDefaultFeeEOA()
  }
}

// this needs to be here because of the failing tests
enum TokenSymbol {
  TRBTC = 'TRBTC',
  RBTC = 'RBTC',
  BTC = 'BTC',
  BTCT = 'BTCT',
  USDRIF = 'USDRIF',
}

export const bitcoinFeeMap = new Map([
  [TokenSymbol.BTC, true],
  [TokenSymbol.BTCT, true],
])

export const rbtcMap = new Map([
  [TokenSymbol.TRBTC, true],
  [TokenSymbol.RBTC, true],
  [undefined, false],
])

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
