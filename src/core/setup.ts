import { providers, Wallet } from 'ethers'
import Resolver from '@rsksmart/rns-resolver.js'
import { OnRequest, RIFWallet } from '../lib/core'
import { AbiEnhancer } from '../lib/abiEnhancer/AbiEnhancer'
import { getWalletSetting, isDefaultChainTypeMainnet, SETTINGS } from './config'
import { RifWalletServicesSocket } from '../lib/rifWalletServices/RifWalletServicesSocket'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'
import axios from 'axios'

export const networkType = getWalletSetting(
  SETTINGS.DEFAULT_CHAIN_TYPE,
) as ChainTypeEnum

const rpcUrl = getWalletSetting(SETTINGS.RPC_URL, networkType)
const smartWalletFactoryAddress = getWalletSetting(
  SETTINGS.SMART_WALLET_FACTORY_ADDRESS,
  networkType,
)

const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl)

export const publicAxios = axios.create({
  baseURL: getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
})

export const authAxios = axios.create({
  baseURL: getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
})

export const abiEnhancer = new AbiEnhancer()

export const rifWalletServicesSocket = new RifWalletServicesSocket(
  getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL, networkType),
  abiEnhancer,
)

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
    RIFWallet.create(
      wallet.connect(jsonRpcProvider),
      smartWalletFactoryAddress,
      onRequest,
      rifRelayConfig,
    ) // temp - using only testnet
