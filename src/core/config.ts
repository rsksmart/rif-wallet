import Config from 'react-native-config'
import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'

import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import config from 'config.json'
export const defaultChainType =
  (Config.DEFAULT_CHAIN_TYPE as ChainTypeEnum) ?? ChainTypeEnum.TESTNET
export const isDefaultChainTypeMainnet =
  defaultChainType === ChainTypeEnum.MAINNET
export const defaultChainId =
  defaultChainType === ChainTypeEnum.MAINNET ? '30' : '31'

export enum SETTINGS {
  DEFAULT_CHAIN_TYPE = 'DEFAULT_CHAIN_TYPE', //the chain id used by default when creating a new account
  RIF_WALLET_SERVICE_URL = 'RIF_WALLET_SERVICE_URL',
  EXPLORER_ADDRESS_URL = 'EXPLORER_ADDRESS_URL',
  EXPLORER_ADDRESS_URL_BTC = 'EXPLORER_ADDRESS_URL_BTC',
  RPC_URL = 'RPC_URL',
  SMART_WALLET_FACTORY_ADDRESS = 'SMART_WALLET_FACTORY_ADDRESS',
  RIF_RELAY_SERVER = 'RIF_RELAY_SERVER',
  RELAY_VERIFIER_ADDRESS = 'RELAY_VERIFIER_ADDRESS',
  DEPLOY_VERIFIER_ADDRESS = 'DEPLOY_VERIFIER_ADDRESS',
  QR_READER_BITCOIN_DEFAULT_NETWORK = 'QR_READER_BITCOIN_DEFAULT_NETWORK',
  AUTH_CLIENT = 'AUTH_CLIENT',
  RIF_WALLET_KEY = 'RIF_WALLET_KEY',
}

/**
 * RSK Mainnet: 30
 * RSK Testnet: 31
 */
export const getWalletSetting = (
  setting: SETTINGS,
  chainType: ChainTypeEnum = defaultChainType,
): string => {
  const key = `${setting}_${chainType}`
  if (key in config) {
    return config[key as keyof typeof config]
  }

  if (Config[key]) {
    return Config[key] || ''
  }

  return Config[setting] || ''
}

export const getTokenAddress = (symbol: string, chainType: ChainTypeEnum) => {
  const contracts =
    chainType === ChainTypeEnum.TESTNET ? testnetContracts : mainnetContracts

  const result = Object.keys(contracts).find(
    (address: string) => contracts[address].symbol === symbol,
  )

  if (!result) {
    throw new Error(
      `Token with the symbol ${symbol} not found on ${chainType}. Did you forget a t?`,
    )
  }
  return result.toLowerCase()
}
