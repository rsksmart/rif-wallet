
import React, { createContext, useContext } from "react"
import { RIFWallet, Request } from "./lib/core"
export type Wallets = { [id: string]: RIFWallet }
export type Requests = Request[]

export type KeyManagementContextType = {
  hasKeys: boolean
  mnemonic?: string
  createFirstWallet: (mnemonic: string) => Promise<void>
}

export type WalletsContextType = {
  wallets: Wallets
  selectedWallet: string
}

export type TempContextType = {
  setRequests: (requests: Requests) => void  // temp - for setting the signTypedData
}

export type AppContextType = KeyManagementContextType & WalletsContextType & TempContextType

export const KeyManagementContext = createContext<KeyManagementContextType>({
  hasKeys: false,
  createFirstWallet: () => Promise.resolve(),
})

export const WalletsContext = createContext<WalletsContextType>({
  wallets: {},
  selectedWallet: '',
})

export const TempContext = createContext<TempContextType>({
  setRequests: () => {}
})

export const AppContextProvider: React.FC<{ value: AppContextType }> = ({ value, children }) => <KeyManagementContext.Provider value={value}>
  <WalletsContext.Provider value={value}>
    <TempContext.Provider value ={value}>
      {children}
    </TempContext.Provider>
  </WalletsContext.Provider>
</KeyManagementContext.Provider>

export const useSelectedWallet = () => {
  const { wallets, selectedWallet } = useContext(WalletsContext)
  const wallet = wallets[selectedWallet]
  console.log('selectedWallet', wallet.address)
  return wallet
}
