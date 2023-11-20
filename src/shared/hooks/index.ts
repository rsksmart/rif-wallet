import { useMemo } from 'react'

import { Wallet } from '../wallet'

export const useAddress = (wallet: Wallet): string => {
  return useMemo(
    () =>
      !wallet?.isRelayWallet ? wallet?.address : wallet?.smartWalletAddress,
    [wallet],
  )
}
