
import { seedToRSKHDKey } from "@rsksmart/rif-id-mnemonic"
import { createContext, useContext, useMemo } from "react"
import { RIFWallet, Request } from "./lib/core"
export type Wallets = { [id: string]: RIFWallet }
export type Requests = Request[]

export type SWalletContextType = {
  wallets: Wallets
  selectedWallet: string,
  requests: Requests
  setRequests: (requests: Requests) => void
}

export const SWalletContext = createContext<SWalletContextType>({
  wallets: {},
  selectedWallet: '',
  requests: [],
  setRequests: (requests: Requests) => {} // temp - for setting the signTypedData
})

export const useSelectedWallet = () => {
  const { wallets, selectedWallet } = useContext(SWalletContext)
  const wallet = wallets[selectedWallet]
  console.log('selectedWallet', wallet.address)
  return wallet
}
