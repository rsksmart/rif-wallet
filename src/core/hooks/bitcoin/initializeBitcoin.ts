import {
  BIPWithRequest,
  BitcoinNetwork,
  BitcoinNetworkWithBIPRequest,
  createAndInitializeBipWithRequest,
  createBipFactoryType,
} from '@rsksmart/rif-wallet-bitcoin'
import { RifWalletServicesFetcher } from '@rsksmart/rif-wallet-services'

import { ChainID } from 'lib/eoaWallet'

import {
  BitcoinNetworkStore,
  StoredBitcoinNetworks,
  StoredBitcoinNetworkValue,
} from 'storage/BitcoinNetworkStore'
import { bitcoinMainnet, bitcoinTestnet } from 'shared/constants'
import { onRequest } from 'store/slices/settingsSlice'
import { AppDispatch } from 'store/index'
import { Bitcoin } from 'store/slices/settingsSlice/types'

const NETWORKS_INITIAL_STATE: Bitcoin = {
  networksArr: [],
  networksMap: {},
}

const onNoNetworksPresent = (chainId: ChainID) => {
  const bitcoinNetwork = chainId === 30 ? bitcoinMainnet : bitcoinTestnet

  BitcoinNetworkStore.addNewNetwork(bitcoinNetwork.name, bitcoinNetwork.bips)

  return BitcoinNetworkStore.getStoredNetworks()
}

const BITCOIN_CHAINID_MAP: Record<ChainID, string> = {
  30: bitcoinMainnet.name,
  31: bitcoinTestnet.name,
}

/**
 * Will return networks as an array, networks as a map (networksMap) and a function to refresh networks from the storage
 * This hook will also instantiate the bitcoin networks with a BIPWithRequest class that will handle the payments for the onRequest method
 * that is required in the wallet
 * @param mnemonic
 * @param dispatch
 * @param fetcher
 * @param chainId
 */
export const initializeBitcoin = (
  mnemonic: string,
  dispatch: AppDispatch,
  fetcher: RifWalletServicesFetcher,
  chainId: ChainID,
) => {
  // Return Object which contains both array and map
  const networksObj = NETWORKS_INITIAL_STATE
  // stored network initial state
  let networksMap: StoredBitcoinNetworks =
    BitcoinNetworkStore.getStoredNetworks()

  // if no networks push new network depending on chainId
  if (Object.values(networksMap).length < 1) {
    networksMap = onNoNetworksPresent(chainId)
  }

  // if there is a network created but does not match current chainId - create it
  if (!networksMap[BITCOIN_CHAINID_MAP[chainId]]) {
    networksMap = onNoNetworksPresent(chainId)
  }
  // Due to how the bitcoin logic is implemented... I'll transform the networksMap to only include the btc network we need
  networksMap = {
    [BITCOIN_CHAINID_MAP[chainId]]: networksMap[BITCOIN_CHAINID_MAP[chainId]],
  }
  const transformNetwork = (
    network: StoredBitcoinNetworkValue,
    mnemonicText: string,
    rifFetcher: RifWalletServicesFetcher,
  ) => {
    const createBipWithFetcher = (...args: createBipFactoryType) => {
      const result: BIPWithRequest = createAndInitializeBipWithRequest(
        request => dispatch(onRequest({ request })),
      )(...args)

      result.fetcher = rifFetcher

      result.paymentFacade.onSendTransaction =
        rifFetcher.sendTransactionHexDataPost
      return result
    }

    const bitcoinNetwork = new BitcoinNetwork(
      network.name,
      network.bips,
      mnemonicText,
      createBipWithFetcher,
    ) as BitcoinNetworkWithBIPRequest

    networksMap[network.name] = bitcoinNetwork

    return bitcoinNetwork
  }

  const transformStoredNetworks = (
    values: StoredBitcoinNetworkValue[],
    mnemonicText: string,
    rifFetcher: RifWalletServicesFetcher,
  ) => {
    const networksArr = values.map(item =>
      transformNetwork(item, mnemonicText, rifFetcher),
    )

    return networksArr
  }

  // transform network to be an array
  const transformedNetworks = transformStoredNetworks(
    Object.values(networksMap),
    mnemonic,
    fetcher,
  )

  // assign values to return object
  networksObj.networksArr = transformedNetworks
  networksObj.networksMap = networksMap

  return networksObj
}
