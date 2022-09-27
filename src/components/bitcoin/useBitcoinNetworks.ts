import { useState, useEffect } from 'react'
import BitcoinNetworkStore, {
  BitcoinNetworkType,
} from '../../storage/BitcoinNetworkStore'

const useBitcoinNetworks = () => {
  const [networks, setNetworks] = useState<BitcoinNetworkType>({})

  const fetchStoredNetworksFromStorage = () => {
    BitcoinNetworkStore.getStoredNetworks().then(setNetworks)
  }
  useEffect(() => {
    fetchStoredNetworksFromStorage()
  }, [])
  return [networks, fetchStoredNetworksFromStorage] as const
}

export default useBitcoinNetworks
