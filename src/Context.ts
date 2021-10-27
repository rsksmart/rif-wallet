
import { seedToRSKHDKey } from "@rsksmart/rif-id-mnemonic"
import { createContext, useContext, useMemo } from "react"
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

export type AppContextType = KeyManagementContextType & WalletsContextType & {
  requests: Requests
  setRequests: (requests: Requests) => void
}

export const SWalletContext = createContext<AppContextType>({
  hasKeys: false,
  createFirstWallet: () => Promise.resolve(),
  wallets: {},
  selectedWallet: '',
  requests: [],
  setRequests: () => {} // temp - for setting the signTypedData
})

export const useSelectedWallet = () => {
  const { wallets, selectedWallet } = useContext(SWalletContext)
  const wallet = wallets[selectedWallet]
  console.log('selectedWallet', wallet.address)
  return wallet
}
