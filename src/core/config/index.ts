import Config from 'react-native-config'
// import local from './local.json'
// import development from './development.json'

export enum SETTINGS {
  RIF_WALLET_SERVICE_URL = 'RIF_WALLET_SERVICE_URL',
  RPC_URL = 'RPC_URL',
  SMART_WALLET_FACTORY_ADDRESS = 'SMART_WALLET_FACTORY_ADDRESS',
}

export enum ENVIRONMENTS {
  LOCAL = 'LOCAL',
  DEVELOPMENT = 'DEVELOPMENT',
}

export const getWalletSetting = (
  setting: SETTINGS,
  chainId: 31 = 31,
): string => {
  /*
  const configurationFile =
    Config.APP_ENV === ENVIRONMENTS.LOCAL ? local : development
  console.log('@jesse 3', Config.APP_ENV)
  console.log('@jesse TACOS', Config.TACOS)
  */
  console.log(Config)

  switch (setting) {
    case SETTINGS.RIF_WALLET_SERVICE_URL:
      return Config.RIF_WALLET_SERVICE_URL
    case SETTINGS.RPC_URL:
      return Config[`NETWORK${chainId.toString()}_RPC_URL`]
    case SETTINGS.SMART_WALLET_FACTORY_ADDRESS:
      return Config[`NETWORK${chainId.toString()}_SW_ADDRESS`]
  }
}
