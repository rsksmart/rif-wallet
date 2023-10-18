import { Wallet, providers } from 'ethers'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'
import { OnRequest, RIFWallet } from '@rsksmart/rif-wallet-core'

import { KeyManagementSystem } from 'lib/core'

import { saveKeys } from 'storage/SecureStorage'
import {
  ChainTypesByIdType,
  chainTypesById,
} from 'shared/constants/chainConstants'
import { MMKVStorage } from 'storage/MMKVStorage'
import { AppDispatch } from 'src/redux'
import { onRequest } from 'src/redux/slices/settingsSlice'

import { getWalletSetting } from './config'
import { SETTINGS } from './types'

// function creates RIF Wallet instance
// along with necessary confings
const createRIFWallet = async (
  chainId: 30 | 31,
  wallet: Wallet,
  onRequestFn: OnRequest,
) => {
  const jsonRpcProvider = new providers.StaticJsonRpcProvider(
    getWalletSetting(SETTINGS.RPC_URL, chainTypesById[chainId]),
  )

  const rifRelayConfig: RifRelayConfig = {
    smartWalletFactoryAddress: getWalletSetting(
      SETTINGS.SMART_WALLET_FACTORY_ADDRESS,
      chainTypesById[chainId],
    ),
    relayVerifierAddress: getWalletSetting(
      SETTINGS.RELAY_VERIFIER_ADDRESS,
      chainTypesById[chainId],
    ),
    deployVerifierAddress: getWalletSetting(
      SETTINGS.DEPLOY_VERIFIER_ADDRESS,
      chainTypesById[chainId],
    ),
    relayServer: getWalletSetting(
      SETTINGS.RIF_RELAY_SERVER,
      chainTypesById[chainId],
    ),
  }

  return await RIFWallet.create(
    wallet.connect(jsonRpcProvider),
    onRequestFn,
    rifRelayConfig,
  )
}

// gets the wallet from KeyManagementSystem
// re-creates the RIFWallet out it
// return kms, rifWallet and rifWalletIsDeployed bool
export const loadExistingWallet = async (
  serializedKeys: string,
  chainId: ChainTypesByIdType,
  dispatch: AppDispatch,
) => {
  try {
    const { kms, wallets } = KeyManagementSystem.fromSerialized(
      serializedKeys,
      chainId,
    )

    const rifWallet = await createRIFWallet(chainId, wallets[0], request =>
      dispatch(onRequest({ request })),
    )
    const rifWalletIsDeployed = await rifWallet.smartWalletFactory.isDeployed()

    return { kms, rifWallet, rifWalletIsDeployed }
  } catch (err) {
    console.log('ERROR IN loadExistingWallet', err)
  }
  return null
}

// creates KeyManagementSystem instance using mnemonic phrase
// using chainId gets save function and Wallet instance
// creates RIFWallet instance out of it
// saves the kms state in encrypted storage of the device
// returns rifWallet and rifWalletIsDeployed bool
export const createKMS = async (
  chainId: ChainTypesByIdType,
  mnemonic: string,
  dispatch: AppDispatch,
) => {
  try {
    const kms = KeyManagementSystem.import(mnemonic)
    const { save, wallet } = kms.nextWallet(chainId)

    const rifWallet = await createRIFWallet(chainId, wallet, request =>
      dispatch(onRequest({ request })),
    )
    const rifWalletIsDeployed = await rifWallet.smartWalletFactory.isDeployed()

    save()
    const result = await saveKeys(kms.serialize())

    if (!result) {
      throw new Error('Could not save keys')
    }

    return {
      rifWallet,
      rifWalletIsDeployed,
    }
  } catch (err) {
    console.log('ERROR IN createKMS', err)
  }
  return null
}

// Not currently used, we'll be needed when support
// for multiple wallets
// export const addNextWallet = async (
//   kms: KeyManagementSystem,
//   createRIFWallet: CreateRIFWallet,
//   chainId: number,
// ) => {
//   const { wallet, save } = kms.nextWallet(chainId)

//   // save wallet in KSM
//   save()
//   // save serialized wallet in storage
//   const result = await saveKeys(kms.serialize())
//   if (!result) {
//     throw new Error('Could not save keys')
//   }
//   const rifWallet = await createRIFWallet(wallet)
//   const isDeloyed = await rifWallet.smartWalletFactory.isDeployed()

//   return {
//     rifWallet,
//     isDeloyed,
//   }
// }

export const deleteCache = () => {
  const cache = new MMKVStorage('txs')
  cache.deleteAll()
}
