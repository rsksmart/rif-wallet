import Config from 'react-native-config'

export enum SETTINGS {
  DEFAULT_CHAIN_ID = 'DEFAULT_CHAIN_ID', //the chain id used by default when creating a new account
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
  chainId: number = 31,
): string => {
  switch (setting) {
    case SETTINGS.DEFAULT_CHAIN_ID:
      return Config.DEFAULT_CHAIN_ID
    case SETTINGS.RIF_WALLET_SERVICE_URL:
      return chainId === 31
        ? Config.RIF_WALLET_SERVICE_URL_TESTNET
        : Config.RIF_WALLET_SERVICE_URL
    case SETTINGS.EXPLORER_ADDRESS_URL:
      return chainId === 31
        ? Config.EXPLORER_ADDRESS_URL_TESTNET
        : Config.EXPLORER_ADDRESS_URL_MAINNET
    case SETTINGS.RPC_URL:
      return Config[`NETWORK${chainId.toString()}_RPC_URL`]
    case SETTINGS.SMART_WALLET_FACTORY_ADDRESS:
      return Config[`NETWORK${chainId.toString()}_SW_ADDRESS`]
  }
}
