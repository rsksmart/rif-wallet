import { createContext, useContext, ReactChild } from 'react'
import { BitcoinNetworkWithBIPRequest } from '@rsksmart/rif-wallet-bitcoin'

import { UseBitcoinCoreResult } from 'core/hooks/bitcoin/useBitcoinCore'

const BitcoinContext =
  createContext<UseBitcoinCoreResult<BitcoinNetworkWithBIPRequest> | null>(null)

export const BitcoinProvider = ({
  BitcoinCore,
  children,
  onSetMnemonic,
}: {
  BitcoinCore: UseBitcoinCoreResult<BitcoinNetworkWithBIPRequest>
  children: ReactChild
  onSetMnemonic?: (mnemonic: string) => void
}) => (
  <BitcoinContext.Provider value={{ ...BitcoinCore, onSetMnemonic }}>
    {children}
  </BitcoinContext.Provider>
)

export const useBitcoinContext = () => useContext(BitcoinContext)
