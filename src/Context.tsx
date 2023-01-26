import { FC } from 'react'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { RegularText } from './components'
import { BitcoinRequest } from './lib/bitcoin/types'
import { Request, RIFWallet } from './lib/core'
import { ScreenWithWallet } from './screens/types'

export interface Wallets {
  [id: string]: RIFWallet
}
export interface WalletsIsDeployed {
  [id: string]: boolean
}
type RequestMixed = Request & BitcoinRequest
export type Requests = RequestMixed[]

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
