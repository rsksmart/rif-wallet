import { useSocketsState } from '../../subscriptions/RIFSockets'
import { useBitcoinCoreContext } from '../../Context'
import React from 'react'
import { IAsset } from './types'

export const useFetchBitcoinNetworksAndTokens = () => {
  const { state } = useSocketsState()
  const { networks } = useBitcoinCoreContext()

  const tokens = React.useMemo(() => Object.values(state.balances), [state])
  const networksSer = networks.map(network => ({
    ...network,
    balance: network.satoshis,
    isBitcoin: true,
  }))
  return React.useMemo(() => {
    return [...networksSer, ...tokens].sort((a, b) =>
      a.symbol.localeCompare(b.symbol),
    ) as IAsset[]
  }, [networks, tokens])
}
