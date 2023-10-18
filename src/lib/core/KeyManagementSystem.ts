import { Wallet } from 'ethers'
import { generateMnemonic, mnemonicToSeedSync, fromSeed } from '@rsksmart/rif-id-mnemonic'
import { getDPathByChainId } from '@rsksmart/rlogin-dpath'

type Mnemonic = string

interface DerivedPaths { [derivatoinPath: string]: string }

interface LastDerivedAccountIndex {
  [chainId: number]: number
}

interface KeyManagementSystemState {
  lastDerivedAccountIndex: LastDerivedAccountIndex
  derivedPaths: DerivedPaths
}

const createInitialState = (): KeyManagementSystemState => ({
  lastDerivedAccountIndex: {},
  derivedPaths: {}
})

interface KeyManagementSystemSerialization {
  mnemonic: Mnemonic
  state: KeyManagementSystemState
}

export interface SaveableWallet {
  derivationPath: string
  wallet: Wallet
  save(): void
}

interface IKeyManagementSystem {
  nextWallet (chainId: number): SaveableWallet
  addWallet (derivationPath: string): SaveableWallet
  removeWallet (derivationPath: string): void
}

/**
 * The Key Management System will derive accounts for a given mnemonic. It allows
 * two type of derivations:
 * - By chain id (nextWallet): it will use an incremental account_index based on BIP-44
 * - Arbitrary derivation paths (addWallet): it will derive the account for the given
 *   path, affecting the accounts by chain id. If an account of a chain is
 *   added, it will be skiped when adding by chain id
 * Both methods will return a { derivationPath, wallet, save } object that can be used
 * to deffer saving the account in the KMS. This can be used to show the user the account
 * before storing it.
 * Use removeWallet to remove it from the KMS. It can be added back by adding as and
 * arbitrary accounts
 * Use serialize/fromSerialized to store the KMS
 */
export class KeyManagementSystem implements IKeyManagementSystem {
  state: KeyManagementSystemState
  mnemonic: Mnemonic

  private constructor (mnemonic: Mnemonic, initialState: KeyManagementSystemState) {
    this.mnemonic = mnemonic
    this.state = initialState
  }

  /**
   * Factory method: generates a mnemonic and initializes the
   * Key Management System
   * @returns a new Key Management System with a new mnemonic
   */
  static create (): KeyManagementSystem {
    const mnemonic = generateMnemonic(12)
    return new KeyManagementSystem(mnemonic, createInitialState())
  }

  /**
   * Factory method: use this method to import a wallet and the
   * used derivation paths
   * @param mnemonic a mnemonic phrase
   * @param state the state of the Key Management System
   * @returns A Key Management System with the given mnemonic and state
   */
  static import (mnemonic: Mnemonic) {
    return new KeyManagementSystem(mnemonic, createInitialState())
  }

  /**
   * Use this method to recover a stored serialized wallet
   * @param serialized the serialized string
   * @param chainId
   * @returns the KeyManagementSystem that was serialized
   */
  static fromSerialized (serialized: string, chainId: number): { kms: KeyManagementSystem, wallets: Wallet[] } {
    const { mnemonic, state }: KeyManagementSystemSerialization = JSON.parse(serialized)

    const kms = new KeyManagementSystem(mnemonic, state)
    // If for some reason the chainId that was passed has not been generated, generate and save it
    if (!state.lastDerivedAccountIndex[chainId]) {
      const newChain = kms.getWalletByChainIdAccountIndex(chainId, 0)
      newChain.save()
    }
    // @TODO Save this state using saveKeys() function
    // This is for incremental rollout, we should add both chains when an user creates a wallet

    // Now, get the derivation path and use that one to return the wallet
    const derivationPath = getDPathByChainId(chainId, 0)
    // try to create the wallet using the private key which is faster, if it fails, the fallback
    // is to use the derivedPath and mnemonic to regenerate the private key and then wallet
    let wallet
    try {
      wallet = new Wallet(state.derivedPaths[derivationPath])
    } catch (_error) {
      const derivedWalletContainer = kms.deriveWallet(derivationPath)
      wallet = derivedWalletContainer.wallet
    }
    // Old logic, should be analyzed to see if it can be removed or the app modified
    /*const wallets = Object.keys(state.derivedPaths)
      .map((derivedPath: string) => {
        try {
          return new Wallet(state.derivedPaths[derivedPath])
        } catch (_error) {
          const { wallet } = kms.deriveWallet(derivedPath)
          return wallet
        }
      })*/
    return {
      kms,
      wallets: [wallet]
    }
  }

  /**
   * Use this method to get a string to be stored and recovered
   * @returns a serialized wallet
   */
  serialize (): string {
    const serialization: KeyManagementSystemSerialization = {
      mnemonic: this.mnemonic,
      state: this.state
    }

    return JSON.stringify(serialization)
  }

  private deriveWallet (derivationPath: string) {
    // Create the seed - ref: BIP-39
    const seed = mnemonicToSeedSync(this.mnemonic)
    const hdKey = fromSeed(seed).derivePath(derivationPath)
    const privateKey = hdKey.privateKey!.toString('hex')
    return { wallet: new Wallet(privateKey), privateKey }
  }

  /**
   * Get the next wallet for the given chainId
   * @param chainId EIP-155 chain Id
   * @returns a savable account
   */
  nextWallet (chainId: number): SaveableWallet {
    // Get the next derivation path for the address - ref: BIP-44
    if (!this.state.lastDerivedAccountIndex[chainId]) {
      this.state.lastDerivedAccountIndex[chainId] = 0
    }

    let derivationPath = getDPathByChainId(chainId, this.state.lastDerivedAccountIndex[chainId])

    while (this.state.derivedPaths[derivationPath]) {
      this.state.lastDerivedAccountIndex[chainId]++
      derivationPath = getDPathByChainId(chainId, this.state.lastDerivedAccountIndex[chainId])
    }

    const { wallet, privateKey } = this.deriveWallet(derivationPath)

    return {
      derivationPath,
      wallet,
      save: () => {
        this.state.derivedPaths[derivationPath] = privateKey
        this.state.lastDerivedAccountIndex[chainId] = this.state.lastDerivedAccountIndex[chainId] + 1
      }
    }
  }

  /**
   * This will get the wallet according to the chain id and accountIndex passed to the function
   * @param chainId
   * @param accountIndex
   */
  getWalletByChainIdAccountIndex(chainId: number, accountIndex: number): SaveableWallet {
    const derivationPath = getDPathByChainId(chainId, accountIndex)
    const { wallet, privateKey } = this.deriveWallet(derivationPath)
    return {
      derivationPath,
      wallet,
      save: () => {
        this.state.derivedPaths[derivationPath] = privateKey
      }
    }
  }

  /**
   * Get the account for an arbitrary derivation path
   * @param derivationPath an arbitrary derivation path
   * @returns a savable wallet
   */
  addWallet (derivationPath: string): SaveableWallet {
    if (this.state.derivedPaths[derivationPath]) throw new Error('Existent wallet')

    const { wallet, privateKey } = this.deriveWallet(derivationPath)

    return {
      derivationPath,
      wallet,
      save: () => {
        this.state.derivedPaths[derivationPath] = privateKey
      }
    }
  }

  /**
   * Remove a wallet from the Key Management System
   * @param derivationPath the derivation path of the wallet to be removed
   */
  removeWallet (derivationPath: string): void {
    if (!this.state.derivedPaths[derivationPath]) throw new Error('Inexistent wallet')

    delete this.state.derivedPaths[derivationPath]
  }
}
