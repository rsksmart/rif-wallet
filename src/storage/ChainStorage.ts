import { ChainTypesByIdType } from 'shared/constants/chainConstants'

import { MainStorage } from './MainStorage'

export const getCurrentChainId: () => ChainTypesByIdType = () =>
  MainStorage.get('chainId') || 31

export const setCurrentChainId = (chainId: ChainTypesByIdType) =>
  MainStorage.set('chainId', chainId)
