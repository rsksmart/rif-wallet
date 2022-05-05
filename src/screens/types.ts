import { SmartWallet } from '@rsksmart/relaying-services-sdk'
import { RIFWallet } from '../lib/core'

export type ScreenWithWallet = { wallet: RIFWallet; isWalletDeployed: boolean }

export interface SmartWalletWithBalance extends SmartWallet {
  balance: string;
  rbtcBalance: string;
}
