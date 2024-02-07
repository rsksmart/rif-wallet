import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import { AddrResolver } from '@rsksmart/rns-sdk'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'
import axios from 'axios'

import { ChainID } from 'lib/eoaWallet'

import { SETTINGS } from 'core/types'
import { MAINNET, TESTNET } from 'screens/rnsManager/addresses.json'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { Wallet } from 'shared/wallet'

import { getWalletSetting } from './config'

export const createPublicAxios = (chainId: ChainID) =>
  axios.create({
    baseURL: getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL, chainId),
  })

export const abiEnhancer = new AbiEnhancer()

export const getRnsResolver = (chainId: ChainID, wallet: Wallet) => {
  const rnsRegistryAddress =
    chainId === 30 ? MAINNET.rnsRegistryAddress : TESTNET.rnsRegistryAddress

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
export const getDefaultTokens = (chainId: ChainID) => {
  return chainId === 30 ? defaultMainnetTokens : defaultTestnetTokens
}
