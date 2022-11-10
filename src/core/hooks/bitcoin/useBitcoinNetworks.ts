import { useState, useCallback } from 'react'
import {
  BitcoinNetworkStore,
  StoredBitcoinNetworks,
} from '../../../storage/BitcoinNetworkStore'

export const useStoredBitcoinNetworks = () => {
  const [networks, setNetworks] = useState<StoredBitcoinNetworks>(
    BitcoinNetworkStore.getStoredNetworks(),
  )

  const refreshNetworks = useCallback(() => {
    setNetworks(BitcoinNetworkStore.getStoredNetworks())
  }, [])

  return [networks, refreshNetworks] as const
}
