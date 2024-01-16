import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import { AddrResolver } from '@rsksmart/rns-sdk'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'
import axios from 'axios'

import { SETTINGS } from 'core/types'
import { MAINNET, TESTNET } from 'screens/rnsManager/addresses.json'
import {
  ChainTypeEnum,
  ChainTypesByIdType,
  chainTypesById,
} from 'shared/constants/chainConstants'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { Wallet } from 'shared/wallet'

import { getWalletSetting } from './config'

export const createPublicAxios = (chainId: ChainTypesByIdType) =>
  axios.create({
    baseURL: getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL, chainId),
  })

export const abiEnhancer = new AbiEnhancer()

export const getRnsResolver = (chainId: ChainTypesByIdType, wallet: Wallet) => {
  const isMainnet = chainTypesById[chainId] === ChainTypeEnum.MAINNET
  const rnsRegistryAddress = isMainnet
    ? MAINNET.rnsRegistryAddress
    : TESTNET.rnsRegistryAddress
  return new AddrResolver(rnsRegistryAddress, wallet)
}

const defaultMainnetTokens: ITokenWithoutLogo[] = Object.keys(mainnetContracts)
  .filter(address =>
    ['RIF', 'USDRIF'].includes(mainnetContracts[address].symbol),
  )
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
    ['tRIF', 'USDRIF'].includes(testnetContracts[address].symbol),
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
    : defaultTestnetTokens
}
