import { FC } from 'react'
import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { ScreenWithWallet } from 'screens/types'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { RequestWithBitcoin } from 'shared/types'

import { RegularText } from './components'

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
      return <RegularText>No selected wallet</RegularText>
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
