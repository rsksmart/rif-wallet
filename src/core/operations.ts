import { KeyManagementSystem } from 'lib/core'

import { saveKeys } from 'storage/SecureStorage'
import { ChainTypesByIdType } from 'shared/constants/chainConstants'
import { MMKVStorage } from 'storage/MMKVStorage'
import { AppDispatch } from 'src/redux'
import { onRequest } from 'src/redux/slices/settingsSlice'

import { createRIFWallet } from './setup'

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
