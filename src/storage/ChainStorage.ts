import { ChainID } from 'lib/eoaWallet'

import { MainStorage } from './MainStorage'

export const getCurrentChainId: () => ChainID = () =>
  MainStorage.get('chainId') || 31

export const setCurrentChainId = (chainId: ChainID) =>
  MainStorage.set('chainId', chainId)
