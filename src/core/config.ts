import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import config from 'config.json'
import ReactNativeConfig from 'react-native-config'
import { constants } from 'ethers'

import { ChainID } from 'lib/eoaWallet'

import { chainTypesById } from 'shared/constants/chainConstants'
import { SETTINGS } from 'core/types'
import { TokenSymbol } from 'screens/home/TokenImage'
import { rbtcMap } from 'shared/utils'

/**
 * This function will get the environment settings from the config.json
 * It requires the chainType because config.json will return a value that depends on the chainId
 * RSK Mainnet: 30
 * RSK Testnet: 31
 */
export const getWalletSetting = (
  setting: SETTINGS,
  chainId: ChainID,
): string => {
  const key = `${setting}_${chainTypesById[chainId]}`
  if (key in config) {
    return config[key as keyof typeof config]
  }

  if (ReactNativeConfig[key]) {
    return ReactNativeConfig[key] || ''
  }

  return ReactNativeConfig[setting] || ''
}
/**
 * This function will get the environment variable from .env
 * @param setting
 */
export const getEnvSetting = (setting: SETTINGS) => ReactNativeConfig[setting]

export const getTokenAddress = (symbol: TokenSymbol, chainId: ChainID) => {
  const contracts = chainId === 31 ? testnetContracts : mainnetContracts

  const result = Object.keys(contracts).find(
    (address: string) =>
      contracts[address].symbol.toUpperCase() === symbol.toUpperCase(),
  )

  if (!result) {
    if (rbtcMap.get(symbol)) {
      return constants.AddressZero.toLowerCase()
    }

    throw new Error(
      `Token with the symbol ${symbol} not found on ${chainId}. Did you forget a t?`,
    )
  }
  return result.toLowerCase()
}
