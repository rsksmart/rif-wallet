import React, { useEffect, useState } from 'react'

import { Wallet } from '../lib/core'
import { QueuedTransaction } from '../lib/core/Account'
import { getStorage, setStorage, StorageKeys } from '../storage'

export interface WalletProviderContextInterface {
  wallet?: Wallet
  setWallet: (wallet: Wallet) => void
  userInteractionQue: QueuedTransaction[]
  handleUxInteraction: any // (qt: QueuedTransaction) => Promise<TransactionRequest>
  resolveUxInteraction: () => void
  reset: () => void
}

export const WalletProviderContext =
  React.createContext<WalletProviderContextInterface>({
    wallet: undefined,
    setWallet: (_wallet: Wallet) => {},
    userInteractionQue: [],
    handleUxInteraction: (_qt: any) => Promise.resolve({}),
    resolveUxInteraction: () => null,
    reset: () => {},
  })

interface Web3ProviderElementInterface {
  children: React.ReactNode
}

export const WalletProviderElement: React.FC<Web3ProviderElementInterface> = ({
  children,
}) => {
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
  const [userInteractionQue, setUserInteractionQue] = useState<
    QueuedTransaction[]
  >([])

  const handleUxInteraction = (transactionRequest: QueuedTransaction) =>
    setUserInteractionQue(userInteractionQue.concat(transactionRequest))

  const resolveUxInteraction = () =>
    setUserInteractionQue(userInteractionQue.slice(1))

  const initialContext: WalletProviderContextInterface = {
    wallet,
    setWallet,
    userInteractionQue,
    handleUxInteraction,
    resolveUxInteraction,
    reset: () => setWallet(undefined),
  }

  // Get the mnemonic from storage, or create a new wallet
  useEffect(() => {
    getStorage(StorageKeys.MNEMONIC)
      .then(
        (mnemonic: string | null) =>
          mnemonic && setWallet(new Wallet({ mnemonic, handleUxInteraction })),
      )
      .catch(() => {
        // Error: key does not present
        const newWallet = Wallet.create(handleUxInteraction)
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
