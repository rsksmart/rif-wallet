import { useSocketsState } from '../../subscriptions/RIFSockets'
import { useBitcoinCoreContext } from '../../Context'
import { useMemo } from 'react'
import { IAsset } from './types'

export const useFetchBitcoinNetworksAndTokens = () => {
  const { state } = useSocketsState()
  const { networks } = useBitcoinCoreContext()

  const tokens = useMemo(() => Object.values(state.balances), [state])
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
