import Config from 'react-native-config'
import { providers } from 'ethers'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'
import { Magic } from '@magic-sdk/react-native-bare'

import { ChainID, EOAWallet, OnRequest, WalletState } from 'lib/eoaWallet'
import { RelayWallet } from 'lib/relayWallet'
import { MagicWallet } from 'lib/magicWallet'

import { Wallet } from '../wallet'

export const isRelayWallet = Config.USE_RELAY === 'true'
export const isSeedlessWallet = Config.IS_SEEDLESS === 'true'

export const createMagicWalletWithEmail = async (
  email: string,
  magic: Magic,
  onRequest: OnRequest,
) => {
  if (isRelayWallet) {
    //@TODO: add MagicRelay instance logic
    return null
  } else {
    return await MagicWallet.create(email, magic, onRequest)
  }
}

export const createAppWallet = async (
  mnemonic: string,
  chainId: ChainID,
  jsonRpcProvider: providers.StaticJsonRpcProvider,
  onRequest: OnRequest,
  config: RifRelayConfig,
  cache?: (privateKey: string, mnemonic?: string) => void,
) => {
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
