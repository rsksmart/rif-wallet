import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

import { EOAWallet } from 'lib/eoaWallet'
import { RelayWallet } from 'lib/relayWallet'

// preparing for having different types of Wallets
// like EOA Wallet, MAGIC etc
export type Wallet = RelayWallet | EOAWallet

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

export const WalletProvider = ({
  children,
}: PropsWithChildren<Record<string, never>>) => {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [walletIsDeployed, setWalletIsDeployed] =
    useState<WalletIsDeployed | null>(null)

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

export const useWallet = () => {
  const { wallet } = useContext(WalletContext)

  if (!wallet) {
    throw new Error('Wallet Has Not Been Set!')
  }

  return wallet
}

export const useWalletIsDeployed = () => {
  const { walletIsDeployed } = useContext(WalletContext)

  if (!walletIsDeployed) {
    throw new Error('Wallet Is Deployed Has Not Been Set!')
  }

  return walletIsDeployed
}

export const useWalletState = () => {
  const { wallet, walletIsDeployed } = useContext(WalletContext)

  if (!wallet || !walletIsDeployed) {
    throw new Error('Wallet Has Not Been Set!')
  }

  return {
    wallet,
    walletIsDeployed,
  }
}

export const useSetWallet = () => {
  const { setWallet } = useContext(WalletContext)

  return {
    setWallet,
  }
}

export const useSetWalletIsDeployed = () => {
  const { setWalletIsDeployed } = useContext(WalletContext)

  return {
    setWalletIsDeployed,
  }
}

export const useInitializeWallet = () => {
  const { initializeWallet } = useContext(WalletContext)

  return initializeWallet
}

export const useWholeWalletWithSetters = () => {
  const {
    wallet,
    walletIsDeployed,
    setWallet,
    setWalletIsDeployed,
    initializeWallet,
  } = useContext(WalletContext)

  if (!wallet || !walletIsDeployed) {
    throw new Error('Wallet State has not been set')
  }

  return {
    wallet,
    walletIsDeployed,
    setWallet,
    setWalletIsDeployed,
    initializeWallet,
  }
}

export const useWalletStateSetters = () => {
  const { setWallet, setWalletIsDeployed, initializeWallet } =
    useContext(WalletContext)

  return {
    setWallet,
    setWalletIsDeployed,
    initializeWallet,
  }
}
