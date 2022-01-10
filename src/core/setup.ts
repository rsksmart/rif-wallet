import { providers, Wallet } from 'ethers'
import Resolver from '@rsksmart/rns-resolver.js'
import { OnRequest, RIFWallet } from '../lib/core'
import { RifWalletServicesFetcher } from '../lib/rifWalletServices/RifWalletServicesFetcher'
import { AbiEnhancer } from '../lib/abiEnhancer/AbiEnhancer'
import { Platform } from 'react-native'

const rpcUrl = 'https://public-node.testnet.rsk.co'
const smartWalletFactoryAddress = '0x3f71ce7bd7912bf3b362fd76dd34fa2f017b6388'
export const rifWalletServicesUrl =
  Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://127.0.0.1:3000' // 'https://rif-wallet-services.testnet.rifcomputing.net/'

const jsonRpcProvider = new providers.JsonRpcProvider(rpcUrl)

export const networkId = 31

export const rifWalletServicesFetcher = new RifWalletServicesFetcher(
  rifWalletServicesUrl,
)
export const abiEnhancer = new AbiEnhancer()
export const rnsResolver = Resolver.forRskTestnet({})

export const createRIFWalletFactory =
  (onRequest: OnRequest) => (wallet: Wallet) =>
    RIFWallet.create(
      wallet.connect(jsonRpcProvider),
      smartWalletFactoryAddress,
      onRequest,
    ) // temp - using only testnet
