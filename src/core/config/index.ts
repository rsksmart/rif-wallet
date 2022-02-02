import local from './local.json'
import production from './production.json'

export enum SETTINGS {
  RIF_WALLET_SERVICE_URL = 'rifWalletServicesUrl',
  RPC_URL = 'rpcUrl',
  SMART_WALLET_FACTORY_ADDRESS = 'SMART_WALLET_FACTORY_ADDRESS',
}

export enum ENVIRONMENTS {
  LOCAL = 'local',
  PRODUCTION = 'production',
}

export const getWalletSetting = (
  setting: SETTINGS,
  chainId: 31 = 31,
): string => {
  const env = ENVIRONMENTS.PRODUCTION
  // @ts-expect-error
  const configurationFile = env === ENVIRONMENTS.LOCAL ? local : production

  switch (setting) {
    case SETTINGS.RIF_WALLET_SERVICE_URL:
      return configurationFile.rifWalletServicesUrl
    case SETTINGS.RPC_URL:
      return configurationFile.networks[chainId].rpcUrl
    case SETTINGS.SMART_WALLET_FACTORY_ADDRESS:
      return configurationFile.networks[chainId].smartWalletFactoryAddress
  }
}
