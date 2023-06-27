import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import config from 'config.json'
import ReactNativeConfig from 'react-native-config'

import { ChainTypeEnum } from 'shared/constants/chainConstants'
import { SETTINGS } from 'core/types'

/**
 * RSK Mainnet: 30
 * RSK Testnet: 31
 */
export const getWalletSetting = (
  setting: SETTINGS,
  chainType: ChainTypeEnum,
): string => {
  const key = `${setting}_${chainType}`
  if (key in config) {
    return config[key as keyof typeof config]
  }

  if (ReactNativeConfig[key]) {
    return ReactNativeConfig[key] || ''
  }

  return ReactNativeConfig[setting] || ''
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
