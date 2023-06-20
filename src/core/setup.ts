import { providers, Wallet } from 'ethers'
import Resolver from '@rsksmart/rns-resolver.js'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'
import { OnRequest, RIFWallet } from '@rsksmart/rif-wallet-core'
import axios from 'axios'
import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'

import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { SETTINGS } from 'core/types'
import { chainTypesById } from 'core/chainConstants'

import { getWalletSetting } from './config'

export const createPublicAxios = (chainId: keyof typeof chainTypesById) =>
  axios.create({
    baseURL: getWalletSetting(
      SETTINGS.RIF_WALLET_SERVICE_URL,
      chainTypesById[chainId],
    ),
  })

export const authAxios = axios.create({
  baseURL: getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
})

export const abiEnhancer = new AbiEnhancer()

export const rnsResolver = Resolver.forRskTestnet({}) // @TODO use chainId
  /*? Resolver.forRskMainnet({})
  : Resolver.forRskTestnet({})*/

export const authClient = getWalletSetting(SETTINGS.AUTH_CLIENT)

export const createRIFWalletFactory =
  (onRequest: OnRequest, chainId: keyof typeof chainTypesById) =>
  (wallet: Wallet) => {
    const jsonRpcProvider = new providers.JsonRpcProvider(
      getWalletSetting(SETTINGS.RPC_URL, chainTypesById[chainId]),
    )
    const rifRelayConfig: RifRelayConfig = {
      smartWalletFactoryAddress: getWalletSetting(
        SETTINGS.SMART_WALLET_FACTORY_ADDRESS,
        chainTypesById[chainId],
      ),
      relayVerifierAddress: getWalletSetting(
        SETTINGS.RELAY_VERIFIER_ADDRESS,
        chainTypesById[chainId],
      ),
      deployVerifierAddress: getWalletSetting(
        SETTINGS.DEPLOY_VERIFIER_ADDRESS,
        chainTypesById[chainId],
      ),
      relayServer: getWalletSetting(
        SETTINGS.RIF_RELAY_SERVER,
        chainTypesById[chainId],
      ),
    }
    return RIFWallet.create(
      wallet.connect(jsonRpcProvider),
      onRequest,
      rifRelayConfig,
    )
  }

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
export const defaultTokens = defaultTestnetTokens // @todo use chainId
  /*? defaultMainnetTokens
  : defaultTestnetTokens*/
