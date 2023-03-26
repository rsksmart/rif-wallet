import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'
import { ColorValue } from 'react-native'
import { RIFWallet, Request } from '@rsksmart/rif-wallet-core'

import { Wallets, WalletsIsDeployed } from 'src/Context'
import { RequestWithBitcoin } from 'shared/types'

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
  request: RequestWithBitcoin
}

export interface SetWalletIsDeployedAction {
  address: string
  value?: boolean
}

export interface SetNewWalletAction {
  rifWallet: RIFWallet
  isDeployed: boolean
}

type RequestMixed = Request & SendBitcoinRequest
export type Requests = RequestMixed[]

export enum ChainTypeEnum {
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET',
}

export interface SettingsSlice {
  isSetup: boolean
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
  previouslyUnlocked: boolean
  fullscreen: boolean
}
