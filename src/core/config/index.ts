import local from './local.json'
import development from './development.json'

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
  const configurationFile = env === ENVIRONMENTS.LOCAL ? local : development

  switch (setting) {
    case SETTINGS.RIF_WALLET_SERVICE_URL:
      return configurationFile.rifWalletServicesUrl
    case SETTINGS.RPC_URL:
      return configurationFile.networks[chainId].rpcUrl
    case SETTINGS.SMART_WALLET_FACTORY_ADDRESS:
      return configurationFile.networks[chainId].smartWalletFactoryAddress
  }
}
