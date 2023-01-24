import { FC } from 'react'
import { Paragraph } from './components'
import { RIFWallet } from 'lib/core'
import { ScreenWithWallet } from 'screens/types'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { RequestWithBitcoin } from 'shared/types'

export interface Wallets {
  [id: string]: RIFWallet
}
export interface WalletsIsDeployed {
  [id: string]: boolean
}

export type Requests = RequestWithBitcoin[]

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
