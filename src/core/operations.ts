import { Wallet } from '@ethersproject/wallet'
import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { KeyManagementSystem } from 'lib/core'

import { saveKeys } from 'storage/SecureStorage'

import { Wallets } from '../Context'
import { MMKVStorage } from '../storage/MMKVStorage'

type CreateRIFWallet = (wallet: Wallet) => Promise<RIFWallet>

export const loadExistingWallets =
  (createRIFWallet: CreateRIFWallet) => async (serializedKeys: string) => {
    const { kms, wallets } = KeyManagementSystem.fromSerialized(serializedKeys)

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
  }

export const createKMS =
  (createRIFWallet: CreateRIFWallet, chainId: number) =>
  async (mnemonic: string) => {
    const kms = KeyManagementSystem.import(mnemonic)
    const { save, wallet } = kms.nextWallet(chainId)

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
  chainId: number,
) => {
  const { wallet, save } = kms.nextWallet(chainId)

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
