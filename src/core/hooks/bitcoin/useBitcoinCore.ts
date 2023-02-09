import { useMemo, useEffect, useCallback, useState, useRef } from 'react'
import {
  BitcoinNetwork,
  BitcoinNetworkWithBIPRequest,
  createAndInitializeBipWithRequest,
  BIPWithRequest,
  createBipFactoryType,
} from '@rsksmart/rif-wallet-bitcoin'

import { RifWalletServicesFetcher } from 'lib/rifWalletServices/RifWalletServicesFetcher'

import {
  BitcoinNetworkStore,
  StoredBitcoinNetworkValue,
} from 'storage/BitcoinNetworkStore'

import { bitcoinMainnet, bitcoinTestnet } from 'shared/costants'
import { useAppDispatch } from 'store/storeUtils'
import { onRequest } from 'store/slices/settingsSlice'

import { useStoredBitcoinNetworks } from './useStoredBitcoinNetworks'
import { isDefaultChainTypeMainnet } from 'core/config'

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
    const bitcoinNetwork = isDefaultChainTypeMainnet
      ? bitcoinMainnet
      : bitcoinTestnet

    BitcoinNetworkStore.addNewNetwork(bitcoinNetwork.name, bitcoinNetwork.bips)

    refreshStoredNetworks()
  }, [refreshStoredNetworks])

  const transformNetwork = useCallback(
    (
      network: StoredBitcoinNetworkValue,
      mnemonicText: string,
      rifFetcher: RifWalletServicesFetcher,
    ) => {
      const createBipWithFetcher = (...args: createBipFactoryType) => {
        const createAndInit = createAndInitializeBipWithRequest(request =>
          dispatch(onRequest({ request })),
        )
        const result: BIPWithRequest = createAndInit(...args)
        result.fetcher = rifFetcher
        result.paymentFacade.onSendTransaction =
          rifFetcher.sendTransactionHexData
        return result
      }
      const bitcoinNetwork = new BitcoinNetwork(
        network.name,
        network.bips,
        mnemonicText,
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
      mnemonicText: string,
      rifFetcher: RifWalletServicesFetcher,
    ) => {
      if (values.length < 1) {
        onNoNetworksPresent()
        return null
      }
      const networksArr = values.map(item =>
        transformNetwork(item, mnemonicText, rifFetcher),
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
    if (!mnemonic) {
      return
    }

    if (!fetcher) {
      return
    }

    const transformedNetworks = transformStoredNetworks(
      storedNetworksValues,
      mnemonic,
      fetcher,
    )
    if (transformedNetworks) {
      setNetworks(transformedNetworks)
    }
  }, [
    storedNetworksValues,
    onNoNetworksPresent,
    transformStoredNetworks,
    fetcher,
    mnemonic,
  ])

  return {
    networks: networks.networksArr,
    networksMap: networks.networksObj,
    refreshStoredNetworks,
  }
}
