import { RIFWallet } from '@rsksmart/rif-wallet-core'
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from 'react'

// preparing for having different types of Wallets
// like EOA Wallet, MAGIC etc
export type Wallet = RIFWallet

interface WalletIsDeployed {
  loading: boolean
  txHash: string | null
  isDeployed: boolean
}

interface WalletContext {
  wallet: Wallet | null
  walletIsDeployed: WalletIsDeployed | null
  setWallet: Dispatch<SetStateAction<Wallet | null>>
  setWalletIsDeployed: Dispatch<SetStateAction<WalletIsDeployed | null>>
}

export const WalletContext = createContext<WalletContext>({
  wallet: null,
  walletIsDeployed: null,
  setWallet: () => ({}),
  setWalletIsDeployed: () => ({}),
})

export const WalletProvider = ({ children }: PropsWithChildren<{}>) => {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [walletIsDeployed, setWalletIsDeployed] =
    useState<WalletIsDeployed | null>(null)

  return (
    <WalletContext.Provider
      value={{
        wallet,
        walletIsDeployed,
        setWallet,
        setWalletIsDeployed,
      }}>
      {children}
    </WalletContext.Provider>
  )
}
