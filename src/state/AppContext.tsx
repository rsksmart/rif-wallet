import { Wallet } from '@ethersproject/wallet'
import React, { useEffect, useState } from 'react'

import { KeyManagementSystem } from '../lib/core/KeyManagementSystem'
import { Request, RIFWallet } from '../lib/core/RIFWallet'
import { jsonRpcProvider } from '../lib/jsonRpcProvider'

import { getStorage, setStorage, StorageKeys } from '../storage'

export interface WalletProviderContextInterface {
  wallets: RIFWallet[]
  getMnemonic: () => string
  saveMnemonic: (mnemonic: string) => Promise<void>
  walletRequests: Request[]
  addUxInteraction: (qt: Request) => void
  resolveUxInteraction: () => void
}

export const WalletProviderContext =
  React.createContext<WalletProviderContextInterface>({
    wallets: [],
    getMnemonic: () => '',
    walletRequests: [],
    saveMnemonic: async () => {},

    handleUxInteraction: (_qt: Request) => Promise.resolve({}),
    addUxInteraction: (_qt: Request) => Promise.resolve({}),
    resolveUxInteraction: () => null,
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
  const [walletRequests, setWalletRequests] = useState<Request[]>([])

  // add and remove items from the UI Que without mutating the state:
  const addUxInteraction = (newRequest: Request) =>
    setWalletRequests(walletRequests.concat(newRequest))
  const resolveUxInteraction = () => setWalletRequests(walletRequests.slice(1))

  const saveMnemonic = async (mnemonic: string) => {
    console.log('setting up new wallet')
    const kms = KeyManagementSystem.import(mnemonic)
    const firstWallet = kms.nextWallet(31)
    firstWallet.save()
    setStorage(StorageKeys.KMS, kms.serialize())

    init({ kms, wallets: [firstWallet.wallet] })
  }

  const initialContext: WalletProviderContextInterface = {
    wallets,
    saveMnemonic,
    getMnemonic: () =>
      keyManagementSystem ? keyManagementSystem?.mnemonic : '',
    walletRequests,
    addUxInteraction,
    resolveUxInteraction,
  }

  const init = async (initProps: {
    kms: KeyManagementSystem
    wallets: Wallet[]
  }) => {
    // save the KMS:
    setKeyManagementSystem(initProps.kms)

    // convert the Wallets[] into RIFWallets[]:
    const tempWallet = initProps.wallets[0] // @todo: change to this to loop
    const ethersWallet = tempWallet.connect(jsonRpcProvider)

    RIFWallet.create(
      ethersWallet,
      '0x3f71ce7bd7912bf3b362fd76dd34fa2f017b6388',
      addUxInteraction,
    ).then((wallet: RIFWallet) => setWallets([wallet]))
  }

  // Get the mnemonic from storage, or create a new KMS with default wallet
  useEffect(() => {
    getStorage(StorageKeys.KMS)
      .then((serialized: string | null) => {
        if (serialized) {
          init(KeyManagementSystem.fromSerialized(serialized))
        }
      })
  }, [])

  return (
    <WalletProviderContext.Provider value={initialContext}>
      {children}
    </WalletProviderContext.Provider>
  )
}
