import React, { createContext, useContext, FC } from 'react'
import { Paragraph } from './components'
import { RIFWallet, Request } from './lib/core'
import { ScreenWithWallet } from './screens/types'
import { BitcoinRequest } from './lib/bitcoin/types'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useBitcoinCoreResultType } from './core/hooks/useBitcoinCore'
import { RifWalletServicesFetcher } from './lib/rifWalletServices/RifWalletServicesFetcher'

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
