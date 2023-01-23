import { RIFWallet, Request } from 'lib/core'
import { BitcoinRequest } from 'lib/bitcoin/types'

import { Wallets, WalletsIsDeployed } from 'src/Context'
import { ColorValue } from 'react-native'

export interface CreateFirstWalletAction {
  mnemonic: string
  networkId?: number
}

export interface AddNewWalletAction {
  networkId: number
}

export interface SetKeysAction {
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

export enum ChainTypeEnum {
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET',
}

export interface SettingsSlice {
  requests: Requests
  topColor: ColorValue
  wallets: Wallets | null
  walletsIsDeployed: WalletsIsDeployed | null
  selectedWallet: string
  loading: boolean
  chainId?: number
  chainType: ChainTypeEnum
  appIsActive: boolean
  unlocked: boolean
}
