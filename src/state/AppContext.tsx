import React, { useState } from 'react'
import { Wallet } from '../lib/core'

export interface WalletProviderContextInterface {
  wallet?: Wallet
  setWallet: (wallet: Wallet) => void
  reset: () => void
}

export const WalletProviderContext =
  React.createContext<WalletProviderContextInterface>({
    wallet: undefined,
    setWallet: (_wallet: Wallet) => {},
    reset: () => {},
  })

interface Web3ProviderElementInterface {
  children: React.ReactNode
}

export const WalletProviderElement: React.FC<Web3ProviderElementInterface> = ({
  children,
}) => {
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)

  const initialContext: WalletProviderContextInterface = {
    wallet,
    setWallet,
    reset: () => setWallet(undefined),
  }

  return (
    <WalletProviderContext.Provider value={initialContext}>
      {children}
    </WalletProviderContext.Provider>
  )
}
