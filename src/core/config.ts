import Config from 'react-native-config'

export enum SETTINGS {
  DEFAULT_CHAIN_ID = 'DEFAULT_CHAIN_ID', //the chain id used by default when creating a new account
  RIF_WALLET_SERVICE_URL = 'RIF_WALLET_SERVICE_URL',
  EXPLORER_ADDRESS_URL = 'EXPLORER_ADDRESS_URL',
  EXPLORER_ADDRESS_URL_BTC = 'EXPLORER_ADDRESS_URL_BTC',
  RPC_URL = 'RPC_URL',
  SMART_WALLET_FACTORY_ADDRESS = 'SMART_WALLET_FACTORY_ADDRESS',
}

/**
 * RSK Mainnet: 30
 * RSK Testnet: 31
 */
export const getWalletSetting = (
  setting: SETTINGS,
  chainId = 31,
  chainType = 'testnet',
): string => {
  switch (setting) {
    case SETTINGS.DEFAULT_CHAIN_ID:
      return Config.DEFAULT_CHAIN_ID
    case SETTINGS.RIF_WALLET_SERVICE_URL:
      return Config.RIF_WALLET_SERVICE_URL
    case SETTINGS.EXPLORER_ADDRESS_URL:
      return chainId === 31
        ? Config.EXPLORER_ADDRESS_URL_TESTNET
        : Config.EXPLORER_ADDRESS_URL_MAINNET
    case SETTINGS.EXPLORER_ADDRESS_URL_BTC:
      return chainType === 'testnet'
        ? Config.BTC_EXPLORER_ADDRESS_URL_TESTNET
        : Config.BTC_EXPLORER_ADDRESS_URL_MAINNET
    case SETTINGS.RPC_URL:
      return Config[`NETWORK${chainId.toString()}_RPC_URL`]
    case SETTINGS.SMART_WALLET_FACTORY_ADDRESS:
      return Config[`NETWORK${chainId.toString()}_SW_ADDRESS`]
  }
}
