import React, { useEffect, useState } from 'react'

// import { Wallet } from '../lib/core'
// import { QueuedTransaction } from '../lib/core/Account'
import { KeyManagementSystem } from '../lib/core/src/KeyManagementSystem'
import { Request, RIFWallet } from '../lib/core/src/RIFWallet'
import { SmartWalletFactory } from '../lib/core/src/SmartWalletFactory'
import { jsonRpcProvider } from '../lib/jsonRpcProvider'

import { getStorage, setStorage, StorageKeys } from '../storage'

export interface WalletProviderContextInterface {
  wallet?: RIFWallet
  // setWallet: (wallet: RIFWallet) => void
  // kms?: KeyManagementSystem
  walletRequest?: Request
  handleUxInteraction: any // (qt: QueuedTransaction) => Promise<TransactionRequest>
  resolveUxInteraction: () => void
  reset: () => void
}

export const WalletProviderContext =
  React.createContext<WalletProviderContextInterface>({
    // kms: undefined,
    wallet: undefined,
    walletRequest: undefined,
    handleUxInteraction: (_qt: Request) => Promise.resolve({}),
    resolveUxInteraction: () => null,
    reset: () => {},
  })

interface Web3ProviderElementInterface {
  children: React.ReactNode
}

export const WalletProviderElement: React.FC<Web3ProviderElementInterface> = ({
  children,
}) => {
  // private state:
  const [keyManagementSystem, setKeyManagementSystem] = useState<
    KeyManagementSystem | undefined
  >(undefined)

  // exposed state via context:
  const [wallet, setWallet] = useState<RIFWallet | undefined>(undefined)
  const [walletRequestQue, setWalletRequestQue] = useState<Request | undefined>(
    undefined,
  )

  const handleUxInteraction = (walletRequest: Request) =>
    setWalletRequestQue(walletRequest)

  const resolveUxInteraction = () => setWalletRequestQue(undefined)

  const initialContext: WalletProviderContextInterface = {
    wallet,
    walletRequest: walletRequestQue,
    handleUxInteraction,
    resolveUxInteraction,
    reset: () => setKeyManagementSystem(undefined),
  }

  const init = async (kms: KeyManagementSystem) => {
    console.log('key management system setup and ready to go!')
    console.log(kms)
    setKeyManagementSystem(kms)
    const walletRequest = kms.nextWallet(31)
    const ethersWallet = walletRequest.wallet.connect(jsonRpcProvider)

    const smartWalletFactory = await SmartWalletFactory.create(
      ethersWallet,
      '0x3f71ce7bd7912bf3b362fd76dd34fa2f017b6388',
    )

    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()
    const rifWallet = RIFWallet.create(
      ethersWallet,
      smartWalletAddress,
      handleUxInteraction,
    )

    setWallet(rifWallet)
  }

  // Get the mnemonic from storage, or create a new wallet
  useEffect(() => {
    getStorage(StorageKeys.KMS)
      .then((serialized: string | null) => {
        if (serialized) {
          init(KeyManagementSystem.fromSerialized(serialized))
        } // @catch this
      })
      .catch(() => {
        // Error: key does not present
        const newKms = KeyManagementSystem.create()
        const firstWallet = newKms.nextWallet(31)
        firstWallet.save()
        setStorage(StorageKeys.KMS, newKms.serialize())
        init(newKms)
      })
  }, [])

  return (
    <WalletProviderContext.Provider value={initialContext}>
      {children}
    </WalletProviderContext.Provider>
  )
}
