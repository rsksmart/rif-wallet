import { Wallet } from '@ethersproject/wallet'
import React, { useEffect, useState } from 'react'

// import { Wallet } from '../lib/core'
// import { QueuedTransaction } from '../lib/core/Account'
import { KeyManagementSystem } from '../lib/core/src/KeyManagementSystem'
import { Request, RIFWallet } from '../lib/core/src/RIFWallet'
import { jsonRpcProvider } from '../lib/jsonRpcProvider'

import { getStorage, setStorage, StorageKeys } from '../storage'

export interface WalletProviderContextInterface {
  wallets: RIFWallet[]
  getMnemonic: () => string
  // setWallet: (wallet: RIFWallet) => void
  // kms?: KeyManagementSystem
  walletRequest?: Request
  handleUxInteraction: any // (qt: QueuedTransaction) => Promise<TransactionRequest>
  resolveUxInteraction: () => void
  reset: () => void
}

export const WalletProviderContext =
  React.createContext<WalletProviderContextInterface>({
    wallets: [],
    getMnemonic: () => '',
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
  const [wallets, setWallets] = useState<RIFWallet[]>([])
  const [walletRequestQue, setWalletRequestQue] = useState<Request | undefined>(
    undefined,
  )

  const handleUxInteraction = (walletRequest: Request) =>
    setWalletRequestQue(walletRequest)

  const resolveUxInteraction = () => setWalletRequestQue(undefined)

  const initialContext: WalletProviderContextInterface = {
    wallets,
    getMnemonic: () =>
      keyManagementSystem ? keyManagementSystem?.mnemonic : '',
    walletRequest: walletRequestQue,
    handleUxInteraction,
    resolveUxInteraction,
    reset: () => setKeyManagementSystem(undefined),
  }

  const init = async (initProps: {
    kms: KeyManagementSystem
    wallets: Wallet[]
  }) => {
    console.log('the init! ;-)', initProps)

    // save the KMS:
    setKeyManagementSystem(initProps.kms)

    // convert the Wallets[] into RIFWallets[]:
    const tempWallet = initProps.wallets[0] // @todo: change to this to loop
    const ethersWallet = tempWallet.connect(jsonRpcProvider)

    RIFWallet.create(
      ethersWallet,
      '0x3f71ce7bd7912bf3b362fd76dd34fa2f017b6388',
      handleUxInteraction,
    ).then((wallet: RIFWallet) => setWallets([wallet]))
  }

  // Get the mnemonic from storage, or create a new KMS with default wallet
  useEffect(() => {
    getStorage(StorageKeys.KMS)
      .then((serialized: string | null) => {
        if (serialized) {
          console.log('getting wallet from storage')
          init(KeyManagementSystem.fromSerialized(serialized))
        }
      })
      .catch(() => {
        // Error: key does not present
        console.log('setting up new wallet')
        const kms = KeyManagementSystem.create()
        const firstWallet = kms.nextWallet(31)
        firstWallet.save()
        setStorage(StorageKeys.KMS, kms.serialize())

        init({ kms, wallets: [firstWallet.wallet] })
      })
  }, [])

  return (
    <WalletProviderContext.Provider value={initialContext}>
      {children}
    </WalletProviderContext.Provider>
  )
}
