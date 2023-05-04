import { useMemo } from 'react'

import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'store/slices/balancesSlice/selectors'

export const useFetchBitcoinNetworksAndTokens = () => {
  const tokenBalances = useAppSelector(selectBalances)

  const tokens = useMemo(() => Object.values(tokenBalances), [tokenBalances])

  return useMemo(() => {
    return tokens.sort((a, b) => a.symbol.localeCompare(b.symbol))
  }, [tokens])
}
