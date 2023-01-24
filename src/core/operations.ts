import { Wallet } from '@ethersproject/wallet'

import { KeyManagementSystem, RIFWallet } from 'lib/core'

import { Wallets } from '../Context'
import { MMKVStorage } from '../storage/MMKVStorage'
import { getKeys, saveKeys } from 'storage/SecureStorage'

type CreateRIFWallet = (wallet: Wallet) => Promise<RIFWallet>

export const loadExistingWallets =
  (createRIFWallet: CreateRIFWallet) => async () => {
    const serializedKeys = await getKeys()
    if (serializedKeys) {
      const { kms, wallets } = KeyManagementSystem.fromSerialized(
        serializedKeys.password,
      )

      const rifWallets = await Promise.all(wallets.map(createRIFWallet))
      const isDeployedWallets = await Promise.all(
        rifWallets.map(w => w.smartWalletFactory.isDeployed()),
      )

      const rifWalletsDictionary = rifWallets.reduce(
        (p: Wallets, c: RIFWallet) => Object.assign(p, { [c.address]: c }),
        {},
      )

      const rifWalletsIsDeployedDictionary = rifWallets.reduce(
        (p: Wallets, c: RIFWallet, ci: number) =>
          Object.assign(p, { [c.address]: isDeployedWallets[ci] }),
        {},
      )

      return { kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary }
    } else {
      return null
    }
  }

export const createKMS =
  (createRIFWallet: CreateRIFWallet, networkId: number) =>
  async (mnemonic: string) => {
    console.log('CREATING KMS', mnemonic)
    const kms = KeyManagementSystem.import(mnemonic)
    const { save, wallet } = kms.nextWallet(networkId)

    const rifWallet = await createRIFWallet(wallet)
    const rifWalletIsDeployed = await rifWallet.smartWalletFactory.isDeployed()

    save()
    const result = await saveKeys(kms.serialize())

    if (!result) {
      throw new Error('Could not save keys')
    }

    const rifWalletsDictionary = { [rifWallet.address]: rifWallet }
    const rifWalletsIsDeployedDictionary = {
      [rifWallet.address]: rifWalletIsDeployed,
    }

    return {
      kms,
      rifWallet,
      rifWalletsDictionary,
      rifWalletsIsDeployedDictionary,
    }
  }

export const addNextWallet = async (
  kms: KeyManagementSystem,
  createRIFWallet: CreateRIFWallet,
  networkId: number,
) => {
  const { wallet, save } = kms.nextWallet(networkId)

  // save wallet in KSM
  save()
  // save serialized wallet in storage
  const result = await saveKeys(kms.serialize())
  if (!result) {
    throw new Error('Could not save keys')
  }
  const rifWallet = await createRIFWallet(wallet)
  const isDeloyed = await rifWallet.smartWalletFactory.isDeployed()

  return {
    rifWallet,
    isDeloyed,
  }
}

export const deleteCache = () => {
  const cache = new MMKVStorage('txs')
  cache.deleteAll()
}
