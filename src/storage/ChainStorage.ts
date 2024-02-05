import { ChainID } from 'lib/eoaWallet'

import { MMKVStorage } from 'storage/MMKVStorage'

const ChainStorage = new MMKVStorage('chainStorage')

export const getCurrentChainId: () => ChainID = () =>
  ChainStorage.get('chainId') || 31

export const setCurrentChainId = (chainId: ChainID) =>
  ChainStorage.set('chainId', chainId)
