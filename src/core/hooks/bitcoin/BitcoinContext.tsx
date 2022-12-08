import { createContext, useContext, ReactChild } from 'react'
import { UseBitcoinCoreResult } from 'core/hooks/bitcoin/useBitcoinCore'

const BitcoinContext = createContext<UseBitcoinCoreResult | null>(null)

export const BitcoinProvider = ({
  BitcoinCore,
  children,
}: {
  BitcoinCore: UseBitcoinCoreResult
  children: ReactChild
}) => (
  <BitcoinContext.Provider value={BitcoinCore}>
    {children}
  </BitcoinContext.Provider>
)

export const useBitcoinContext = () => useContext(BitcoinContext)
