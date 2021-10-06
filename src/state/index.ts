// The app's state uses useState. In the near future, this may
// be expanded to use redux.

import { Account, Wallet } from '../lib/core'

export interface stateInterface {
  // will move to context:
  wallet: Wallet
  accounts: Account[]

  // will move to redux:
  mnemonic: string
}

export const initialState = {
  wallet: Wallet.create(),
  accounts: [],
  mnemonic: '',
  addresses: [],
}
