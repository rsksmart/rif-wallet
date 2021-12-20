import { Wallet } from '@ethersproject/wallet'
import { KeyManagementSystem, RIFWallet } from '../lib/core'
import { getKeys, saveKeys } from '../storage/KeyStore'
import { Wallets } from '../Context'

export { deleteKeys, hasKeys } from '../storage/KeyStore'

type CreateRIFWallet = (wallet: Wallet) => Promise<RIFWallet>

export const loadExistingWallets =
  (createRIFWallet: CreateRIFWallet) => async () => {
    const serializedKeys = await getKeys()
    // eslint-disable-next-line no-shadow
    const { kms, wallets } = KeyManagementSystem.fromSerialized(serializedKeys!)

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

export const creteKMS =
  (createRIFWallet: CreateRIFWallet, networkId: number) =>
  async (mnemonic: string) => {
    const kms = KeyManagementSystem.import(mnemonic)
    const { save, wallet } = kms.nextWallet(networkId)

    const rifWallet = await createRIFWallet(wallet)
    const rifWalletIsDeployed = await rifWallet.smartWalletFactory.isDeployed()

    save()
    const serialized = kms.serialize()
    await saveKeys(serialized)

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
