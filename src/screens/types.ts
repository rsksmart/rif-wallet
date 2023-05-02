import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { WalletsIsDeployed } from 'src/Context'

export type ScreenWithWallet = {
  wallet: RIFWallet
  walletDeployed: WalletsIsDeployed[string]
}
