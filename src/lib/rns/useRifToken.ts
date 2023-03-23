import { TokenSymbol } from 'screens/home/TokenImage'
import { selectBalances } from 'store/slices/balancesSlice'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'

export const useRifToken = () => {
  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)

  const rifSymbols = [TokenSymbol.RIF, TokenSymbol.TRIF].map(symbol =>
    symbol.toUpperCase(),
  )

  const rifToken = Object.values(tokenBalances).find(({ symbol }) => {
    symbol = symbol.toUpperCase()
    return rifSymbols.includes(symbol)
  })

  const rifTokenAddress = rifToken?.contractAddress || ''
  const rifTokenPrice = prices[rifTokenAddress]?.price

  return {
    ...rifToken,
    price: rifTokenPrice,
  }
}
