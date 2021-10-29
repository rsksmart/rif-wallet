
import { createContext, useContext } from "react"
import { RIFWallet, Request } from "./lib/core"
export type Wallets = { [id: string]: RIFWallet }
export type Requests = Request[]

export type AppContextType = {
  wallets: Wallets
  selectedWallet: string
  setRequests: (requests: Requests) => void  // temp - for setting the signTypedData
}

export const AppContext = createContext<AppContextType>({
  wallets: {},
  selectedWallet: '',
  setRequests: () => {}
})

export const useSelectedWallet = () => {
  const { wallets, selectedWallet } = useContext(AppContext)
  const wallet = wallets[selectedWallet]
  console.log('selectedWallet', wallet.address)
  return wallet
}
