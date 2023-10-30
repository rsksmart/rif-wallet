import { RIFWallet } from '@rsksmart/rif-wallet-core'
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
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

export type SetWallet = Dispatch<SetStateAction<Wallet | null>>
export type SetWalletIsDeployed = Dispatch<
  SetStateAction<WalletIsDeployed | null>
>

interface WalletContext {
  wallet: Wallet | null
  walletIsDeployed: WalletIsDeployed | null
  setWallet: SetWallet
  setWalletIsDeployed: SetWalletIsDeployed
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

  useEffect(() => {
    console.log('wallet updated', wallet)
  }, [wallet])

  useEffect(() => {
    console.log('walletIsDeployed updated', walletIsDeployed)
  }, [walletIsDeployed])

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
