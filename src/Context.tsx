import { FC } from 'react'
import { Paragraph } from './components'
import { RIFWallet, Request } from './lib/core'
import { ScreenWithWallet } from './screens/types'
import { UseBitcoinCoreResult } from './core/hooks/bitcoin/useBitcoinCore'
import { BitcoinRequest } from './lib/bitcoin/types'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'

export interface Wallets {
  [id: string]: RIFWallet
}
export interface WalletsIsDeployed {
  [id: string]: boolean
}
type RequestMixed = Request & BitcoinRequest
export type Requests = RequestMixed[]

export type AppContextType = {
  mnemonic?: string
  wallets: Wallets
  walletsIsDeployed: WalletsIsDeployed
  selectedWallet?: string
  chainId?: number
  BitcoinCore: UseBitcoinCoreResult
}

export function InjectSelectedWallet<T>(
  Component: FC<ScreenWithWallet & T>,
): FC<T> {
  return function InjectedComponent(props) {
    const { wallet, isDeployed } = useAppSelector(selectActiveWallet)

    if (!wallet) {
      return <Paragraph>No selected wallet</Paragraph>
    }

    return (
      <Component
        wallet={wallet}
        isWalletDeployed={Boolean(isDeployed)}
        {...props}
      />
    )
  }
}
