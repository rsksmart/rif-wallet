import { selectBalances } from 'store/slices/balancesSlice'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'

export const useRifToken = () => {
  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)

  const rifToken = Object.values(tokenBalances).find(
    token => token.symbol === 'RIF' || token.symbol === 'tRIF',
  )
  const rifTokenAddress = rifToken?.contractAddress || ''
  const rifTokenPrice = prices[rifTokenAddress]?.price

  return {
    ...rifToken,
    price: rifTokenPrice,
  }
}
