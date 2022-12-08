import { useMemo } from 'react'

import { useAppSelector } from 'store/storeUtils'
import { selectBitcoinCore } from 'store/slices/settingsSlice'
import { selectBalances } from 'store/slices/balancesSlice/selectors'
import { IAsset } from './types'

export const useFetchBitcoinNetworksAndTokens = () => {
  const tokenBalances = useAppSelector(selectBalances)
  const bitcoinCore = useAppSelector(selectBitcoinCore)

  const tokens = useMemo(() => Object.values(tokenBalances), [tokenBalances])
  const networksSer = bitcoinCore
    ? bitcoinCore.networks.map(network => ({
        ...network,
        balance: network.satoshis,
        isBitcoin: true,
      }))
    : []
  return useMemo(() => {
    return [...networksSer, ...tokens].sort((a, b) =>
      a.symbol.localeCompare(b.symbol),
    ) as IAsset[]
  }, [bitcoinCore, tokens])
}
