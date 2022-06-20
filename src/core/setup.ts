import { providers, Wallet } from 'ethers'
import Resolver from '@rsksmart/rns-resolver.js'
import { OnRequest, RIFWallet } from '../lib/core'
import { RifWalletServicesFetcher } from '../lib/rifWalletServices/RifWalletServicesFetcher'
import { AbiEnhancer } from '../lib/abiEnhancer/AbiEnhancer'
import { getWalletSetting, SETTINGS } from './config'
import { RifWalletServicesSocket } from '../lib/rifWalletServices/RifWalletServicesSocket'
import { RifRelayService } from '../lib/rifRelayService/RifRelayService'
import Web3 from 'web3'

export const networkId = 31
export const testTokenAddress = '0xF5859303f76596dD558B438b18d0Ce0e1660F3ea'

const rpcUrl = getWalletSetting(SETTINGS.RPC_URL, networkId)
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

export const rifRelayService = new RifRelayService(
  ['https://dev.relay.rifcomputing.net:8090'],
  '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387',
  '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9',
  '0x5C6e96a84271AC19974C3e99d6c4bE4318BfE483',
  '0xEdB6D515C2DB4F9C3C87D7f6Cefb260B3DEe8014',
  '0xc6a4f4839b074b2a75ebf00a9b427ccb8073b7b4',
  smartWalletFactoryAddress,
  testTokenAddress,
  rpcUrl)

export const rnsResolver = Resolver.forRskTestnet({})

export const createRIFWalletFactory =
  (onRequest: OnRequest) => (wallet: Wallet) =>
    RIFWallet.create(
      wallet.connect(jsonRpcProvider),
      smartWalletFactoryAddress,
      onRequest,
    ) // temp - using only testnet
