// The app's state uses useState. In the near future, this may
// be expanded to use redux.

import { RIFWallet } from '../lib/core'

export interface stateInterface {
  // will move to context:
  wallet: RIFWallet

  // will move to redux:
  mnemonic: string
  addresses: string[]
}

export const initialState = {
  wallet: new RIFWallet(),
  mnemonic: '',
  addresses: [],
}
