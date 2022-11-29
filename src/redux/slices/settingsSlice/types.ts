import { KeyManagementSystem, RIFWallet, Request } from 'lib/core'
import { BitcoinRequest } from 'lib/bitcoin/types'

import { Wallets, WalletsIsDeployed } from 'src/Context'
import { UseBitcoinCoreResult } from 'core/hooks/bitcoin/useBitcoinCore'
import { ColorValue } from 'react-native'

export interface CreateFirstWalletAction {
  mnemonic: string
  networkId?: number
}

export interface AddNewWalletAction {
  networkId: number
}

export interface SetKeysAction {
  kms: KeyManagementSystem
  wallets: Wallets
  walletsIsDeployed: WalletsIsDeployed
}

export interface OnRequestAction {
  request: Request
}

export interface SetWalletIsDeployedAction {
  address: string
  value?: boolean
}

export interface SetNewWalletAction {
  rifWallet: RIFWallet
  isDeployed: boolean
}

type RequestMixed = Request & BitcoinRequest
export type Requests = RequestMixed[]

export interface SettingsSlice {
  requests: Requests
  topColor: ColorValue
  hasKeys: boolean
  hasPin: boolean
  kms: KeyManagementSystem | null
  wallets: Wallets | null
  walletsIsDeployed: WalletsIsDeployed | null
  selectedWallet: string
  loading: boolean
  BitcoinCore: UseBitcoinCoreResult | null
  chainId: number | null
}
