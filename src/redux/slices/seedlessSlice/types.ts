import { Magic } from '@magic-sdk/react-native-bare'

import { InitializeWallet } from 'shared/wallet'

export interface SeedlessState {
  loading: boolean
}

export interface EmailLogin {
  email: string
  initializeWallet: InitializeWallet
  magic: Magic
}
