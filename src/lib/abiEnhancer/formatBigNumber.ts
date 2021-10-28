import { BigNumber as EthBigNumber } from '@ethersproject/bignumber'
import BigNumber from 'bignumber.js'

export const formatBigNumber = (price: EthBigNumber, decimals: number) => {
  const MAX_DECIMALS = 5

  const bigNumber = new BigNumber(price.toString()).div(10 ** decimals)

  const decimalPlaces = bigNumber.decimalPlaces()

  if (decimalPlaces > 0 && decimalPlaces < MAX_DECIMALS) {
    return bigNumber.toFormat(decimalPlaces)
  }

  if (decimalPlaces >= MAX_DECIMALS) {
    return bigNumber.toFormat(MAX_DECIMALS)
  }

  return bigNumber.toFormat()
}
