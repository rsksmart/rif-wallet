import { useMemo, useEffect, useCallback, useState, useRef } from 'react'
import BIP39 from 'lib/bitcoin/BIP39'
import BitcoinNetwork from 'lib/bitcoin/BitcoinNetwork'
import { BitcoinNetworkWithBIPRequest } from 'lib/bitcoin/types'
import { createAndInitializeBipWithRequest } from 'lib/bitcoin/utils'

import {
  BitcoinNetworkStore,
  StoredBitcoinNetworkValue,
} from 'storage/BitcoinNetworkStore'
import { bitcoinTestnet } from 'shared/costants'
import { useStoredBitcoinNetworks } from './useStoredBitcoinNetworks'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { onRequest, selectKMS } from 'store/slices/settingsSlice'

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

export const useBitcoinCore = (): UseBitcoinCoreResult => {
  const dispatch = useAppDispatch()
  const kms = useAppSelector(selectKMS)
  const [storedNetworks, refreshStoredNetworks] = useStoredBitcoinNetworks()
  const BIP39Instance = useMemo(
    () => (kms ? new BIP39(kms.mnemonic) : null),
    [kms],
  )
  const networksObj = useRef<NetworksObject>({})
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

  const onNoNetworksPresent = useCallback(() => {
    BitcoinNetworkStore.addNewNetwork(bitcoinTestnet.name, bitcoinTestnet.bips)
    refreshStoredNetworks()
  }, [refreshStoredNetworks])

  const transformNetwork = useCallback(
    (network: StoredBitcoinNetworkValue, bip39: BIP39) => {
      const bitcoinNetwork = new BitcoinNetwork(
        network.name,
        network.bips,
        bip39,
        createAndInitializeBipWithRequest(request =>
          dispatch(onRequest({ request })),
        ),
      ) as BitcoinNetworkWithBIPRequest
      networksObj.current[network.name] = bitcoinNetwork
      return bitcoinNetwork
    },
    [dispatch],
  )

  const transformStoredNetworks = useCallback(
    (values: StoredBitcoinNetworkValue[], bip39: BIP39) => {
      if (values.length < 1) {
        onNoNetworksPresent()
        return null
      }
      const networksArr = values.map(item => transformNetwork(item, bip39))

      return { networksArr, networksObj: networksObj.current }
    },
    [transformNetwork, onNoNetworksPresent],
  )

  useEffect(() => {
    if (storedNetworksValues.length < 1) {
      onNoNetworksPresent()
      return
    }

    if (!BIP39Instance) {
      return
    }

    const transformedNetworks = transformStoredNetworks(
      storedNetworksValues,
      BIP39Instance,
    )
    if (transformedNetworks) {
      setNetworks(transformedNetworks)
    }
  }, [
    storedNetworksValues,
    onNoNetworksPresent,
    transformStoredNetworks,
    BIP39Instance,
  ])

  return {
    networks: networks.networksArr,
    networksMap: networks.networksObj,
    refreshStoredNetworks,
  }
}
