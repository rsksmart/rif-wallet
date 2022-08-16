import Config from 'react-native-config'

export enum SETTINGS {
  RIF_WALLET_SERVICE_URL = 'RIF_WALLET_SERVICE_URL',
  RPC_URL = 'RPC_URL',
  SMART_WALLET_FACTORY_ADDRESS = 'SMART_WALLET_FACTORY_ADDRESS',
}

export const getWalletSetting = (
  setting: SETTINGS,
  chainId: 31 = 31,
): string => {
  switch (setting) {
    case SETTINGS.RIF_WALLET_SERVICE_URL:
      return Config.RIF_WALLET_SERVICE_URL
    case SETTINGS.RPC_URL:
      return Config[`NETWORK${chainId.toString()}_RPC_URL`]
    case SETTINGS.SMART_WALLET_FACTORY_ADDRESS:
      return '0xeaB5b9fA91aeFFaA9c33F9b33d12AB7088fa7f6f'
      return Config[`NETWORK${chainId.toString()}_SW_ADDRESS`]
  }
}
