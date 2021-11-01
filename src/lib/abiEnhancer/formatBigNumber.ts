import { BigNumber } from 'ethers'

export const formatBigNumber = (amount: BigNumber, decimals: number) => {
  console.log(amount, decimals)
  const divisor = BigNumber.from(10).pow(BigNumber.from(decimals))

  const quotient = amount.div(divisor)
  const rest = amount.mod(divisor)

  console.log(quotient.toString())

  return quotient.toString() + (rest.isZero() ? '' :rest.toString().slice(0, 4))
}
