import Config from 'react-native-config'

import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
export const defaultChainType =
  (Config.DEFAULT_CHAIN_TYPE as ChainTypeEnum) || ChainTypeEnum.TESTNET
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
  RIF_CONTRACT_ADDRESS = 'RIF_CONTRACT_ADDRESS',
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
  if (Config[`${setting}_${chainType}`]) {
    return Config[`${setting}_${chainType}`]
  }

  return Config[setting]
}
