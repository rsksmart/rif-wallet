import { useMemo, useEffect, useCallback, useState, useRef } from 'react'
import {
  BitcoinNetwork,
  BitcoinNetworkWithBIPRequest,
  BIP39,
  createAndInitializeBipWithRequest,
  BIPWithRequest,
  createBipFactoryType,
} from '@rsksmart/rif-wallet-bitcoin'

import {
  BitcoinNetworkStore,
  StoredBitcoinNetworkValue,
} from 'storage/BitcoinNetworkStore'
import { bitcoinTestnet } from 'shared/costants'
import { useStoredBitcoinNetworks } from './useStoredBitcoinNetworks'
import { useAppDispatch } from 'store/storeUtils'
import { onRequest } from 'store/slices/settingsSlice'
import { RifWalletServicesFetcher } from 'src/lib/rifWalletServices/RifWalletServicesFetcher'

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
 * @param fetcher
 */

export const useBitcoinCore = (
  mnemonic: string | null,
  fetcher?: RifWalletServicesFetcher,
): UseBitcoinCoreResult => {
  const dispatch = useAppDispatch()
  const [storedNetworks, refreshStoredNetworks] = useStoredBitcoinNetworks()
  const BIP39Instance = useMemo(
    () => (mnemonic ? new BIP39(mnemonic) : null),
    [mnemonic],
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
    (
      network: StoredBitcoinNetworkValue,
      bip39: BIP39,
      rifFetcher: RifWalletServicesFetcher,
    ) => {
      const createBipWithFetcher = (...args: createBipFactoryType) => {
        const createAndInit = createAndInitializeBipWithRequest(request =>
          dispatch(onRequest({ request })),
        )
        const result: BIPWithRequest = createAndInit(...args)
        result.fetcher = rifFetcher
        return result
      }
      const bitcoinNetwork = new BitcoinNetwork(
        network.name,
        network.bips,
        bip39,
        createBipWithFetcher,
      ) as BitcoinNetworkWithBIPRequest
      networksObj.current[network.name] = bitcoinNetwork
      return bitcoinNetwork
    },
    [dispatch],
  )

  const transformStoredNetworks = useCallback(
    (
      values: StoredBitcoinNetworkValue[],
      bip39: BIP39,
      rifFetcher: RifWalletServicesFetcher,
    ) => {
      if (values.length < 1) {
        onNoNetworksPresent()
        return null
      }
      const networksArr = values.map(item =>
        transformNetwork(item, bip39, rifFetcher),
      )

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

    if (!fetcher) {
      return
    }

    const transformedNetworks = transformStoredNetworks(
      storedNetworksValues,
      BIP39Instance,
      fetcher,
    )
    if (transformedNetworks) {
      setNetworks(transformedNetworks)
    }
  }, [
    storedNetworksValues,
    onNoNetworksPresent,
    transformStoredNetworks,
    BIP39Instance,
    fetcher,
  ])

  return {
    networks: networks.networksArr,
    networksMap: networks.networksObj,
    refreshStoredNetworks,
  }
}
