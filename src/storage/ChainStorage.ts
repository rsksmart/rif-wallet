import ReactNativeConfig from 'react-native-config'

import { SETTINGS } from 'core/types'

import { MainStorage } from './MainStorage'

const ChainStorageKey = 'chainIdKey'

interface ChainIdStoreProps {
  setChainId: (chainId: number) => void
  getChainId: () => 30 | 31
}
export const ChainIdStore: ChainIdStoreProps = {
  setChainId: (chainId: number) => MainStorage.set(ChainStorageKey, chainId),
  getChainId: () =>
    MainStorage.get(ChainStorageKey) ??
    ReactNativeConfig[SETTINGS.DEFAULT_CHAIN_TYPE],
}
