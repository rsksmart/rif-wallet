import { RIFWallet } from '../lib/core'

export type ScreenWithWallet = {
  wallet: RIFWallet
  chainId: number
  isWalletDeployed: boolean
}
