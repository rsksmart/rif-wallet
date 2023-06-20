import {
  BitcoinNetwork,
  BitcoinNetworkWithBIPRequest,
  createAndInitializeBipWithRequest,
  BIPWithRequest,
  createBipFactoryType,
} from '@rsksmart/rif-wallet-bitcoin'
import { RifWalletServicesFetcher } from '@rsksmart/rif-wallet-services'
import Keychain from 'react-native-keychain'

import {
  BitcoinNetworkStore,
  StoredBitcoinNetworkValue,
} from 'storage/BitcoinNetworkStore'
import { bitcoinMainnet, bitcoinTestnet } from 'shared/costants'
import { onRequest } from 'store/slices/settingsSlice'
import { AppDispatch } from 'store/index'
import { StoredBitcoinNetworks } from 'storage/BitcoinNetworkStore'
import { Bitcoin } from 'store/slices/settingsSlice/types'

const NETWORKS_INITIAL_STATE: Bitcoin = {
  networksArr: [],
  networksMap: {},
}

const onNoNetworksPresent = () => {
  const bitcoinNetwork = bitcoinTestnet // @TODO use chainId 
    /*? bitcoinMainnet
    : bitcoinTestnet*/

  BitcoinNetworkStore.addNewNetwork(bitcoinNetwork.name, bitcoinNetwork.bips)

  return BitcoinNetworkStore.getStoredNetworks()
}

/**
 * Will return networks as an array, networks as a map (networksMap) and a function to refresh networks from the storage
 * This hook will also instantiate the bitcoin networks with a BIPWithRequest class that will handle the payments for the onRequest method
 * that is required in the wallet
 * @param mnemonic
 * @param fetcher
 */

export const initializeBitcoin = (
  mnemonic: string,
  dispatch: AppDispatch,
  fetcher: RifWalletServicesFetcher<
    Keychain.Options,
    ReturnType<typeof Keychain.setInternetCredentials>
  >,
) => {
  // Return Object which contains both array and map
  const networksObj = NETWORKS_INITIAL_STATE
  // stored network initial state
  let networksMap: StoredBitcoinNetworks =
    BitcoinNetworkStore.getStoredNetworks()

  // if no networks push TESTNET
  if (Object.values(networksMap).length < 1) {
    networksMap = onNoNetworksPresent()
  }

  const transformNetwork = (
    network: StoredBitcoinNetworkValue,
    mnemonicText: string,
    rifFetcher: RifWalletServicesFetcher<
      Keychain.Options,
      ReturnType<typeof Keychain.setInternetCredentials>
    >,
  ) => {
    const createBipWithFetcher = (...args: createBipFactoryType) => {
      const result: BIPWithRequest = createAndInitializeBipWithRequest(
        request => dispatch(onRequest({ request })),
      )(...args)

      result.fetcher = rifFetcher

      result.paymentFacade.onSendTransaction = rifFetcher.sendTransactionHexData
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
    rifFetcher: RifWalletServicesFetcher<
      Keychain.Options,
      ReturnType<typeof Keychain.setInternetCredentials>
    >,
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
