import { BigNumber } from 'ethers'

export const formatBigNumber = (amount: BigNumber, decimals: number) => {
  if (amount.isZero()) {
    return '0'
  }

  const divisor = BigNumber.from(10).pow(BigNumber.from(decimals))

  const quotient = amount.div(divisor)
  const rest = amount.mod(divisor)

  // https://stackoverflow.com/questions/5774246/remove-trailing-characters-from-string-in-javascript
  return (
    quotient.toString() +
    (rest.isZero()
      ? ''
      : '.' +
        rest.toString().padStart(decimals, '0').slice(0, 8).replace(/0+$/, ''))
  )
}
