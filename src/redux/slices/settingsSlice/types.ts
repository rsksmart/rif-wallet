import { BitcoinNetworkWithBIPRequest } from '@rsksmart/rif-wallet-bitcoin'
import { ColorValue } from 'react-native'

import { ChainID } from 'lib/eoaWallet'

import { RequestWithBitcoin } from 'shared/types'
import { InitializeWallet, Wallet } from 'shared/wallet'

export type ResetAppPayload =
  | undefined
  | {
      wallet: Wallet
    }

export interface WalletIsDeployed {
  loading: boolean
  txHash: string | null
  isDeployed: boolean
}

export interface WalletsIsDeployed {
  [id: string]: WalletIsDeployed
}

export interface CreateFirstWalletAction {
  mnemonic: string
  initializeWallet: InitializeWallet
  networkId?: number
  onSetMnemonic?: (mnemonic: string) => void
}

export interface AddNewWalletAction {
  networkId: number
}

export interface UnlockAppAction {
  initializeWallet: InitializeWallet
  isOffline?: boolean
  pinUnlocked?: boolean
  setGlobalError: (value: string) => void
}

export interface SetKeysAction {
  wallet: Wallet
  walletIsDeployed: WalletIsDeployed
}

export interface OnRequestAction {
  request: RequestWithBitcoin
}

export interface SetWalletIsDeployedAction {
  address: string
  value?: boolean
}

export interface SetNewWalletAction {
  rifWallet: Wallet
  isDeployed: boolean
}

export enum ChainTypeEnum {
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET',
}

export interface NetworksObject {
  [key: string]: BitcoinNetworkWithBIPRequest
}

export interface Bitcoin {
  networksArr: BitcoinNetworkWithBIPRequest[]
  networksMap: NetworksObject
}

export interface SettingsSlice {
  isSetup: boolean
  requests: RequestWithBitcoin[]
  topColor: ColorValue
  selectedWallet: string
  loading: boolean
  chainId: ChainID
  appIsActive: boolean
  unlocked: boolean
  previouslyUnlocked: boolean
  fullscreen: boolean
  hideBalance: boolean
  bitcoin: Bitcoin | null
  usedBitcoinAddresses: { [key: string]: string }
}
