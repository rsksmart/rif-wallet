// The app's state uses useState. In the near future, this may
// be expanded to use redux.

import { Wallet } from '../lib/core'

export interface stateInterface {
  // will move to context:
  wallet: Wallet

  // will move to redux:
  mnemonic: string
  addresses: string[]
}

export const initialState = {
  wallet: new Wallet(),
  mnemonic: '',
  addresses: [],
}
