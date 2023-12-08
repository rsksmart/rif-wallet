import { useMemo } from 'react'

import { RelayWallet } from 'lib/relayWallet'

import { Wallet } from '../wallet'

export const addressToUse = (wallet: Wallet) =>
  !(wallet instanceof RelayWallet) ? wallet.address : wallet.smartWalletAddress

export const useAddress = (wallet: Wallet): string => {
  return useMemo(() => addressToUse(wallet), [wallet])
}
