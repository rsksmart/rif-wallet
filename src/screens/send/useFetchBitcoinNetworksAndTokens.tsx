import { useMemo } from 'react'

import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { ITokenOrBitcoinWithBIPRequest } from 'screens/send/types'
import { selectBitcoin } from 'src/redux/slices/settingsSlice'

export const useFetchBitcoinNetworksAndTokens = () => {
  const tokenBalances = useAppSelector(selectBalances)
  const bitcoinCore = useAppSelector(selectBitcoin)

  const tokens = useMemo(() => Object.values(tokenBalances), [tokenBalances])
  const networksSer = useMemo(
    () =>
      bitcoinCore
        ? bitcoinCore.networksArr.map(network => ({
            ...network,
            balance: network.satoshis,
            isBitcoin: true,
          }))
        : [],
    [bitcoinCore],
  )

  return useMemo(() => {
    return [...networksSer, ...tokens].sort((a, b) =>
      a.symbol.localeCompare(b.symbol),
    )
  }, [tokens, networksSer]) as ITokenOrBitcoinWithBIPRequest[]
}
