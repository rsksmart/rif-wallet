import React, { createContext, useContext, FC } from 'react'
import { RIFWallet, Request } from './lib/core'
import { ScreenWithWallet } from './screens/types'
export type Wallets = { [id: string]: RIFWallet }
export type Requests = Request[]

export type AppContextType = {
  mnemonic?: string
  wallets: Wallets
  selectedWallet?: string
  setRequests: (requests: Requests) => void // temp - for setting the signTypedData
}

export const AppContext = createContext<AppContextType>({
  wallets: {},
  setRequests: () => {},
})

export const useSelectedWallet = () => {
  const { wallets, selectedWallet } = useContext(AppContext)
  return wallets[selectedWallet!]
}

export function InjectSelectedWallet<T>(
  Component: FC<ScreenWithWallet & T>,
): FC<T> {
  return function InjectedComponent({ ...props }) {
    const wallet = useSelectedWallet()
    if (!wallet) {
      throw new Error('No selected wallet')
    }
    return <Component wallet={wallet} {...props} />
  }
}
