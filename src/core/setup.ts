import { providers, Wallet } from 'ethers'
import Resolver from '@rsksmart/rns-resolver.js'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'
import { OnRequest, RIFWallet } from '@rsksmart/rif-wallet-core'
import axios from 'axios'
import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'

import { getWalletSetting, isDefaultChainTypeMainnet, SETTINGS } from './config'
import { RifWalletServicesSocket } from '@rsksmart/rif-wallet-services'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { MMKVStorage } from 'storage/MMKVStorage'
import { enhanceTransactionInput } from 'screens/activity/ActivityScreen'
import { filterEnhancedTransactions } from 'src/subscriptions/utils'
import { Options, setInternetCredentials } from 'react-native-keychain'

export const networkType = getWalletSetting(
  SETTINGS.DEFAULT_CHAIN_TYPE,
) as ChainTypeEnum

const rpcUrl = getWalletSetting(SETTINGS.RPC_URL, networkType)

const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl)

export const publicAxios = axios.create({
  baseURL: getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
})

export const authAxios = axios.create({
  baseURL: getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
})

export const abiEnhancer = new AbiEnhancer()

export const rifWalletServicesSocket = new RifWalletServicesSocket<
  Options,
  ReturnType<typeof setInternetCredentials>
>(getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL, networkType), abiEnhancer, {
  cache: new MMKVStorage('temp'),
  encryptionKeyMessageToSign: getWalletSetting(SETTINGS.RIF_WALLET_KEY),
  onEnhanceTransaction: enhanceTransactionInput,
  onFilterOutRepeatedTransactions: filterEnhancedTransactions,
  onBeforeInit: (encryptionKey, currentInstance) => {
    currentInstance.cache = new MMKVStorage('txs', encryptionKey)
  },
})

export const rnsResolver = isDefaultChainTypeMainnet
  ? Resolver.forRskMainnet({})
  : Resolver.forRskTestnet({})

export const authClient = getWalletSetting(SETTINGS.AUTH_CLIENT)

export const rifRelayConfig: RifRelayConfig = {
  smartWalletFactoryAddress: getWalletSetting(
    SETTINGS.SMART_WALLET_FACTORY_ADDRESS,
  ),
  relayVerifierAddress: getWalletSetting(SETTINGS.RELAY_VERIFIER_ADDRESS),
  deployVerifierAddress: getWalletSetting(SETTINGS.DEPLOY_VERIFIER_ADDRESS),
  relayServer: getWalletSetting(SETTINGS.RIF_RELAY_SERVER),
}

export const createRIFWalletFactory =
  (onRequest: OnRequest) => (wallet: Wallet) =>
    RIFWallet.create(wallet.connect(jsonRpcProvider), onRequest, rifRelayConfig)

const defaultMainnetTokens = {
  '0x2aCc95758f8b5F583470bA265Eb685a8f45fC9D5': {
    balance: '0x00',
    contractAddress: '0x2aCc95758f8b5F583470bA265Eb685a8f45fC9D5',
    decimals: 18,
    name: 'RIF',
    symbol: 'RIF',
  },

  '0x2d919f19D4892381d58EdEbEcA66D5642ceF1A1F': {
    balance: '0x00',
    contractAddress: '0x2d919f19D4892381d58EdEbEcA66D5642ceF1A1F',
    decimals: 18,
    name: 'Rif Dollar on Chain',
    symbol: 'RDOC',
  },
}

const defaultTestnetTokens = {
  '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe': {
    balance: '0x00',
    contractAddress: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    decimals: 18,
    name: 'tRIF Token',
    symbol: 'tRIF',
  },

  '0xc3de9f38581f83e281f260d0ddbaac0e102ff9f8': {
    balance: '0x00',
    contractAddress: '0xc3de9f38581f83e281f260d0ddbaac0e102ff9f8',
    decimals: 18,
    name: 'Rif Dollar on Chain',
    symbol: 'RDOC',
  },
}
export const defaultTokens = isDefaultChainTypeMainnet
  ? defaultMainnetTokens
  : defaultTestnetTokens
