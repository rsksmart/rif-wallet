import Config from 'react-native-config'
import { providers } from 'ethers'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'

import { ChainID, EOAWallet, OnRequest, WalletState } from 'lib/eoaWallet'
import { RelayWallet } from 'lib/relayWallet'

import { Wallet } from '../wallet'

export const isRelayWallet = Config.USE_RELAY === 'true'

export const createAppWallet = async (
  mnemonic: string,
  chainId: ChainID,
  jsonRpcProvider: providers.StaticJsonRpcProvider,
  onRequest: OnRequest,
  config: RifRelayConfig,
  cache?: (privateKey: string, mnemonic?: string) => void,
) => {
  console.log('USE RELAY createAppWallet', isRelayWallet)
  let wallet: Wallet

  if (isRelayWallet) {
    wallet = await RelayWallet.create(
      mnemonic,
      chainId,
      jsonRpcProvider,
      onRequest,
      config,
      cache,
    )
  } else {
    wallet = EOAWallet.create(
      mnemonic,
      chainId,
      jsonRpcProvider,
      onRequest,
      cache,
    )
  }

  return wallet
}

export const loadAppWallet = async (
  keys: WalletState,
  chainId: ChainID,
  jsonRpcProvider: providers.StaticJsonRpcProvider,
  onRequest: OnRequest,
  config: RifRelayConfig,
) => {
  console.log('USE RELAY loadAppWallet', isRelayWallet)

  let wallet: Wallet

  if (isRelayWallet) {
    wallet = await RelayWallet.fromWalletState(
      keys,
      chainId,
      jsonRpcProvider,
      onRequest,
      config,
    )
  } else {
    wallet = EOAWallet.fromWalletState(
      keys,
      chainId,
      jsonRpcProvider,
      onRequest,
    )
  }

  return wallet
}
