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
import { USDRIF_TESTNET } from 'screens/home/TokenImage'

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
export const getDefaultTokens = (chainId: ChainTypesByIdType) => {
  return chainTypesById[chainId] === ChainTypeEnum.MAINNET
    ? defaultMainnetTokens
    : [...defaultTestnetTokens, USDRIF_TESTNET]
}
