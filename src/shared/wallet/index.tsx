import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

import { RelayWallet } from 'lib/relayWallet'
import { EOAWallet } from 'lib/eoaWallet'
import { RnsProcessor } from 'lib/rns'

import { AppDispatch } from 'store/store'
import { handleTransactionStatusChange } from 'store/shared/utils'
import { RNS_ADDRESSES_BY_CHAIN_ID } from 'screens/rnsManager/types'
import { useAppDispatch } from 'store/storeUtils'
import { getCurrentChainId } from 'storage/ChainStorage'

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
export type GetRnsProcessor = () => RnsProcessor | null

interface WalletContext {
  wallet: Wallet | null
  walletIsDeployed: WalletIsDeployed | null
  rnsProcessor: RnsProcessor | null
  initializeWallet: InitializeWallet
  setWallet: SetWallet
  setWalletIsDeployed: SetWalletIsDeployed
  getRnsProcessor: GetRnsProcessor
}

const createRNSPRocessor = (wallet: Wallet, dispatch: AppDispatch) => {
  return new RnsProcessor(
    wallet,
    handleTransactionStatusChange(dispatch),
    RNS_ADDRESSES_BY_CHAIN_ID[getCurrentChainId()],
  )
}

export const WalletContext = createContext<WalletContext>({
  wallet: null,
  walletIsDeployed: null,
  rnsProcessor: null,
  initializeWallet: () => ({}),
  setWallet: () => ({}),
  setWalletIsDeployed: () => ({}),
  getRnsProcessor: () => null,
})

export const WalletProvider = ({
  children,
}: PropsWithChildren<Record<string, never>>) => {
  const dispatch = useAppDispatch()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [walletIsDeployed, setWalletIsDeployed] =
    useState<WalletIsDeployed | null>(null)
  const [rnsProcessor, setRnsProcessor] = useState<RnsProcessor | null>(null)

  const initializeWallet = useCallback(
    (walletArg: Wallet, walletIsDeployedArg: WalletIsDeployed) => {
      setWallet(walletArg)
      setWalletIsDeployed(walletIsDeployedArg)
      setRnsProcessor(createRNSPRocessor(walletArg, dispatch))
    },
    [dispatch],
  )

  const getRnsProcessor = useCallback(() => {
    return rnsProcessor
  }, [rnsProcessor])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        walletIsDeployed,
        rnsProcessor,
        initializeWallet,
        setWallet,
        setWalletIsDeployed,
        getRnsProcessor,
      }}>
      {children}
    </WalletContext.Provider>
  )
}

export const addressToUse = (wallet: Wallet) =>
  !(wallet instanceof RelayWallet) ? wallet.address : wallet.smartWalletAddress

export const useWallet = () => {
  const { wallet, walletIsDeployed } = useContext(WalletContext)

  if (!wallet) {
    throw new Error('Wallet Has Not Been Set!')
  }

  if (!walletIsDeployed) {
    throw new Error('WalletIsDeployed Has Not Been Set!')
  }

  const address = addressToUse(wallet)

  return { wallet, address, walletIsDeployed }
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

export const useGetRnsProcessor = () => {
  const { getRnsProcessor } = useContext(WalletContext)

  return getRnsProcessor
}
