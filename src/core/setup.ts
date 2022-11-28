import { providers, Wallet } from 'ethers'
import Resolver from '@rsksmart/rns-resolver.js'
import { OnRequest, RIFWallet } from '../lib/core'
import { RifWalletServicesFetcher } from '../lib/rifWalletServices/RifWalletServicesFetcher'
import { AbiEnhancer } from '../lib/abiEnhancer/AbiEnhancer'
import { getWalletSetting, SETTINGS } from './config'
import { RifWalletServicesSocket } from '../lib/rifWalletServices/RifWalletServicesSocket'

export const networkId = getWalletSetting(SETTINGS.DEFAULT_CHAIN_ID)

const rpcUrl = getWalletSetting(SETTINGS.RPC_URL, parseInt(networkId, 10))
const smartWalletFactoryAddress = getWalletSetting(
  SETTINGS.SMART_WALLET_FACTORY_ADDRESS,
)

const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl)

export const rifWalletServicesFetcher = new RifWalletServicesFetcher(
  getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
)

export const abiEnhancer = new AbiEnhancer()

export const rifWalletServicesSocket = new RifWalletServicesSocket(
  getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
  rifWalletServicesFetcher,
  abiEnhancer,
)

export const rnsResolver = Resolver.forRskTestnet({})

export const createRIFWalletFactory =
  (onRequest: OnRequest) => (wallet: Wallet) =>
    RIFWallet.create(
      wallet.connect(jsonRpcProvider),
      smartWalletFactoryAddress,
      onRequest,
    ) // temp - using only testnet
