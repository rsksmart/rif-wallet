import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import { AddrResolver } from '@rsksmart/rns-sdk'
import axios from 'axios'

import { ChainID } from 'lib/eoaWallet'

import { SETTINGS } from 'core/types'
import { MAINNET, TESTNET } from 'screens/rnsManager/addresses.json'
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
