import { providers, Wallet } from 'ethers'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'
import { OnRequest, RIFWallet } from '@rsksmart/rif-wallet-core'
import axios from 'axios'
import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'
import Resolver from '@rsksmart/rns-resolver.js'

import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { SETTINGS } from 'core/types'
import {
  ChainTypeEnum,
  chainTypesById,
  ChainTypesByIdType,
} from 'shared/constants/chainConstants'

import { getWalletSetting } from './config'

export const createPublicAxios = (chainId: ChainTypesByIdType) =>
  axios.create({
    baseURL: getWalletSetting(
      SETTINGS.RIF_WALLET_SERVICE_URL,
      chainTypesById[chainId],
    ),
  })

export const abiEnhancer = new AbiEnhancer()

export const getRnsResolver = (chainId: ChainTypesByIdType) =>
  chainTypesById[chainId] === ChainTypeEnum.MAINNET
    ? Resolver.forRskMainnet({})
    : Resolver.forRskTestnet({})

export const createRIFWalletFactory =
  (onRequest: OnRequest, chainId: ChainTypesByIdType) => (wallet: Wallet) => {
    const jsonRpcProvider = new providers.StaticJsonRpcProvider(
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
      usdBalance: 0,
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
      usdBalance: 0,
    }
  })
export const getDefaultTokens = (chainId: ChainTypesByIdType) =>
  chainTypesById[chainId] === ChainTypeEnum.MAINNET
    ? defaultMainnetTokens
    : defaultTestnetTokens
