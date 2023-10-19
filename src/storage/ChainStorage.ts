import { ChainTypesByIdType } from 'shared/constants/chainConstants'
import { MMKVStorage } from 'storage/MMKVStorage'

const ChainStorage = new MMKVStorage('chainStorage')

export const getCurrentChainId: () => ChainTypesByIdType = () =>
  ChainStorage.get('chainId') || 31

export const setCurrentChainId = (chainId: ChainTypesByIdType) =>
  ChainStorage.set('chainId', chainId)
