import React, { createContext, useContext, FC } from 'react'
import { Paragraph } from './components'
import { RIFWallet, Request } from './lib/core'
import { ScreenWithWallet } from './screens/types'
export type Wallets = { [id: string]: RIFWallet }
export type WalletsIsDeployed = { [id: string]: boolean }
export type Requests = Request[]

export type AppContextType = {
  mnemonic?: string
  wallets: Wallets
  walletsIsDeployed: WalletsIsDeployed
  selectedWallet?: string
  chainId?: number
}

export const AppContext = createContext<AppContextType>({
  wallets: {},
  walletsIsDeployed: {},
  chainId: undefined,
})

export const useSelectedWallet = () => {
  const { wallets, walletsIsDeployed, selectedWallet, chainId } =
    useContext(AppContext)

  return {
    wallet: wallets[selectedWallet!],
    isDeployed: walletsIsDeployed[selectedWallet!],
    chainId,
    selectedWalletIndex: selectedWallet
      ? Object.keys(wallets).indexOf(selectedWallet)
      : undefined,
  }
}

export function InjectSelectedWallet<T>(
  Component: FC<ScreenWithWallet & T>,
): FC<T> {
  return function InjectedComponent(props) {
    const { wallet, isDeployed } = useSelectedWallet()

    if (!wallet) {
      return <Paragraph>No selected wallet</Paragraph>
    }

    return (
      <Component wallet={wallet} isWalletDeployed={isDeployed} {...props} />
    )
  }
}
