import { Wallet } from '@ethersproject/wallet'
import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { KeyManagementSystem } from 'lib/core'

import { saveKeys } from 'storage/SecureStorage'
import { ChainTypesByIdType } from 'shared/constants/chainConstants'
import { MMKVStorage } from 'storage/MMKVStorage'

type CreateRIFWallet = (wallet: Wallet) => Promise<RIFWallet>

export const loadExistingWallet =
  (createRIFWallet: CreateRIFWallet) =>
  async (serializedKeys: string, chainId: ChainTypesByIdType) => {
    try {
      const { kms, wallets } = KeyManagementSystem.fromSerialized(
        serializedKeys,
        chainId,
      )

      const rifWallet = await createRIFWallet(wallets[0])
      const rifWalletIsDeployed =
        await rifWallet.smartWalletFactory.isDeployed()

      return { kms, rifWallet, rifWalletIsDeployed }
    } catch (err) {
      console.log('ERROR IN loadExistingWallet', err)
    }
    return null
  }

export const createKMS =
  (createRIFWallet: CreateRIFWallet, chainId: number) =>
  async (mnemonic: string) => {
    try {
      const kms = KeyManagementSystem.import(mnemonic)
      const { save, wallet } = kms.nextWallet(chainId)

      const rifWallet = await createRIFWallet(wallet)
      const rifWalletIsDeployed =
        await rifWallet.smartWalletFactory.isDeployed()

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
