import Config from 'react-native-config'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'

export enum SETTINGS {
  DEFAULT_CHAIN_TYPE = 'DEFAULT_CHAIN_TYPE', //the chain id used by default when creating a new account
  RIF_WALLET_SERVICE_URL = 'RIF_WALLET_SERVICE_URL',
  EXPLORER_ADDRESS_URL = 'EXPLORER_ADDRESS_URL',
  RPC_URL = 'RPC_URL',
  SMART_WALLET_FACTORY_ADDRESS = 'SMART_WALLET_FACTORY_ADDRESS',
}

/**
 * RSK Mainnet: 30
 * RSK Testnet: 31
 */
export const getWalletSetting = (
  setting: SETTINGS,
  chainType: ChainTypeEnum = ChainTypeEnum.TESTNET,
): string => {
  switch (setting) {
    case SETTINGS.DEFAULT_CHAIN_TYPE:
      return Config.DEFAULT_CHAIN_TYPE
    case SETTINGS.RIF_WALLET_SERVICE_URL:
      return Config.RIF_WALLET_SERVICE_URL
    case SETTINGS.EXPLORER_ADDRESS_URL:
      return chainType === ChainTypeEnum.TESTNET
        ? Config.EXPLORER_ADDRESS_URL_TESTNET
        : Config.EXPLORER_ADDRESS_URL_MAINNET
    case SETTINGS.RPC_URL:
      return chainType === ChainTypeEnum.TESTNET
        ? Config.NETWORK_RPC_URL_TESTNET
        : Config.NETWORK_RPC_URL_MAINNET
    case SETTINGS.SMART_WALLET_FACTORY_ADDRESS:
      return chainType === ChainTypeEnum.TESTNET
        ? Config.NETWORK_SW_ADDRESS_TESTNET
        : Config.NETWORK_SW_ADDRESS_MAINNET
  }
}
