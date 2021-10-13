import React, { useEffect, useState } from 'react'
import { Wallet } from '../lib/core'
import { getStorage, setStorage, StorageKeys } from '../storage'

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

  // Get the mnemonic from storage, or create a new wallet
  useEffect(() => {
    getStorage(StorageKeys.MNEMONIC)
      .then(
        (mnemonic: string | null) =>
          mnemonic && setWallet(new Wallet({ mnemonic })),
      )
      .catch(() => {
        // Error: key does not present
        const newWallet = Wallet.create()
        setStorage(StorageKeys.MNEMONIC, newWallet.getMnemonic).then(() =>
          setWallet(newWallet),
        )
      })
  }, [])

  return (
    <WalletProviderContext.Provider value={initialContext}>
      {children}
    </WalletProviderContext.Provider>
  )
}
