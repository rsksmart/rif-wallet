import { useMemo } from 'react'

import { RelayWallet } from 'lib/relayWallet'
import { MagicRelayWallet } from 'lib/magicRelayWallet'

import { Wallet } from '../wallet'

export const addressToUse = (wallet: Wallet) =>
  !(wallet instanceof RelayWallet || wallet instanceof MagicRelayWallet)
    ? wallet.address
    : wallet.smartWalletAddress

export const useAddress = (wallet: Wallet): string => {
  return useMemo(() => addressToUse(wallet), [wallet])
}
