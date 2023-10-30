import { RIFWallet } from '@rsksmart/rif-wallet-core'
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
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

export type InitializeWallet = (
  wallet: Wallet,
  walletIsDeployed: WalletIsDeployed,
) => void
export type SetWallet = Dispatch<SetStateAction<Wallet | null>>
export type SetWalletIsDeployed = Dispatch<
  SetStateAction<WalletIsDeployed | null>
>

interface WalletContext {
  wallet: Wallet | null
  walletIsDeployed: WalletIsDeployed | null
  initializeWallet: InitializeWallet
  setWallet: SetWallet
  setWalletIsDeployed: SetWalletIsDeployed
}

export const WalletContext = createContext<WalletContext>({
  wallet: null,
  walletIsDeployed: null,
  initializeWallet: () => ({}),
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

  const initializeWallet = useCallback(
    (walletArg: Wallet, walletIsDeployedArg: WalletIsDeployed) => {
      setWallet(walletArg)
      setWalletIsDeployed(walletIsDeployedArg)
    },
    [],
  )

  return (
    <WalletContext.Provider
      value={{
        wallet,
        walletIsDeployed,
        initializeWallet,
        setWallet,
        setWalletIsDeployed,
      }}>
      {children}
    </WalletContext.Provider>
  )
}
