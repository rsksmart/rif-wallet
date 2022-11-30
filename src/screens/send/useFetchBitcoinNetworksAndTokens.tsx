import { useBitcoinCoreContext } from 'src/Context'
import { useMemo } from 'react'
import { IAsset } from './types'
import { useAppSelector } from 'store/storeHooks'
import { selectBalances } from 'store/slices/balancesSlice/selectors'

export const useFetchBitcoinNetworksAndTokens = () => {
  const tokenBalances = useAppSelector(selectBalances)
  const { networks } = useBitcoinCoreContext()

  const tokens = useMemo(() => Object.values(tokenBalances), [tokenBalances])
  const networksSer = networks.map(network => ({
    ...network,
    balance: network.satoshis,
    isBitcoin: true,
  }))
  return useMemo(() => {
    return [...networksSer, ...tokens].sort((a, b) =>
      a.symbol.localeCompare(b.symbol),
    ) as IAsset[]
  }, [networks, tokens])
}
