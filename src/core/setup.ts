import { providers, Wallet } from 'ethers'
import Resolver from '@rsksmart/rns-resolver.js'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'
import { OnRequest, RIFWallet } from '@rsksmart/rif-wallet-core'
import axios from 'axios'
import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'

import { getWalletSetting, isDefaultChainTypeMainnet } from './config'
import { RifWalletServicesSocket } from '@rsksmart/rif-wallet-services'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { MMKVStorage } from 'storage/MMKVStorage'
import { enhanceTransactionInput } from 'screens/activity/ActivityScreen'
import { filterEnhancedTransactions } from 'src/subscriptions/utils'
import { Options, setInternetCredentials } from 'react-native-keychain'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { SETTINGS } from 'core/types';

export const networkType = getWalletSetting(
  SETTINGS.DEFAULT_CHAIN_TYPE,
) as ChainTypeEnum

const rpcUrl = getWalletSetting(SETTINGS.RPC_URL)

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

const defaultMainnetTokens: ITokenWithoutLogo[] = Object.keys(mainnetContracts)
  .filter(address => ['RDOC', 'RIF'].includes(mainnetContracts[address].symbol))
  .map(address => {
    const { decimals, name, symbol } = mainnetContracts[address]
    return {
      decimals,
      name,
      symbol,
      contractAddress: address.toLowerCase(),
      balance: '0x00',
    }
  })
const defaultTestnetTokens: ITokenWithoutLogo[] = Object.keys(testnetContracts)
  .filter(address =>
    ['RDOC', 'tRIF'].includes(testnetContracts[address].symbol),
  )
  .map(address => {
    const { decimals, name, symbol } = testnetContracts[address]
    return {
      decimals,
      name,
      symbol,
      contractAddress: address.toLowerCase(),
      balance: '0x00',
    }
  })
export const defaultTokens = isDefaultChainTypeMainnet
  ? defaultMainnetTokens
  : defaultTestnetTokens
