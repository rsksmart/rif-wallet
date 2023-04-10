import { useMemo } from 'react'

import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import { ITokenOrBitcoinWithBIPRequest } from 'screens/send/types'

export const useFetchBitcoinNetworksAndTokens = () => {
  const tokenBalances = useAppSelector(selectBalances)
  const bitcoinCore = useBitcoinContext()

  const tokens = useMemo(() => Object.values(tokenBalances), [tokenBalances])
  const networksSer = useMemo(
    () =>
      bitcoinCore
        ? bitcoinCore.networks.map(network => ({
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
