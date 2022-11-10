import { useMemo, useEffect, useCallback, useState, useRef } from 'react'
import BIP39 from '../../../lib/bitcoin/BIP39'
import BitcoinNetwork from '../../../lib/bitcoin/BitcoinNetwork'
import {
  BitcoinNetworkStore,
  StoredBitcoinNetworkValue,
} from '../../../storage/BitcoinNetworkStore'
import { OnRequest } from '../../../lib/core'
import { BitcoinNetworkWithBIPRequest } from '../../../lib/bitcoin/types'
import { createAndInitializeBipWithRequest } from '../../../lib/bitcoin/utils'
import { bitcoinTestnet } from '../../../shared/costants'
import { useStoredBitcoinNetworks } from './useBitcoinNetworks'

export interface UseBitcoinCoreResult {
  networks: Array<BitcoinNetwork>
  networksMap: {
    [key: string]: BitcoinNetwork
  }
  refreshStoredNetworks: () => void
}

interface NetworksObject {
  [key: string]: BitcoinNetworkWithBIPRequest
}

/**
 * Hook that will return networks as an array, networks as a map (networksMap) and a function to refresh networks from the storage
 * This hook will also instantiate the bitcoin networks with a BIPWithRequest class that will handle the payments for the onRequest method
 * that is required in the wallet
 * @param mnemonic
 * @param request
 */

export const useBitcoinCore = (
  mnemonic: string,
  request: OnRequest,
): UseBitcoinCoreResult => {
  const [storedNetworks, refreshStoredNetworks] = useStoredBitcoinNetworks()
  const BIP39Instance = useMemo(() => new BIP39(mnemonic), [mnemonic])
  const networksObj = useRef<NetworksObject>({}).current
  const storedNetworksValues = useMemo(
    () => Object.values(storedNetworks),
    [storedNetworks],
  )
  const [networks, setNetworks] = useState<{
    networksArr: BitcoinNetworkWithBIPRequest[]
    networksObj: NetworksObject
  }>({
    networksArr: [],
    networksObj: {},
  })

  const transformNetwork = useCallback((network: StoredBitcoinNetworkValue) => {
    const bitcoinNetwork = new BitcoinNetwork(
      network.name,
      network.bips,
      BIP39Instance,
      createAndInitializeBipWithRequest(request),
    ) as BitcoinNetworkWithBIPRequest
    networksObj[network.name] = bitcoinNetwork
    return bitcoinNetwork
  }, [])

  const transformStoredNetworks = useCallback(
    (values: StoredBitcoinNetworkValue[]) => {
      if (values.length < 1) {
        onNoNetworksPresent()
        return null
      }
      if (!mnemonic) {
        return null
      }
      const networksArr = values.map(transformNetwork)

      return { networksArr, networksObj }
    },
    [mnemonic],
  )

  const onNoNetworksPresent = useCallback(() => {
    BitcoinNetworkStore.addNewNetwork(bitcoinTestnet.name, bitcoinTestnet.bips)
    refreshStoredNetworks()
  }, [])

  useEffect(() => {
    if (storedNetworksValues.length < 1) {
      onNoNetworksPresent()
      return
    }
    const transformedNetworks = transformStoredNetworks(storedNetworksValues)
    if (transformedNetworks) {
      setNetworks(transformedNetworks)
    }
  }, [storedNetworks])

  return {
    networks: networks.networksArr,
    networksMap: networks.networksObj,
    refreshStoredNetworks,
  }
}
