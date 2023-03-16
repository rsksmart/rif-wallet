export const useRnsDomainPriceInRif = async (_: string, years: number) => {
  // TODO: re enable this later
  /*const price = await rskRegistrar.price(domain, BigNumber.from(years))
    return utils.formatUnits(price, 18)*/
  if (years < 3) {
    return years * 2
  } else {
    return 4 + (years - 2)
  }
}
