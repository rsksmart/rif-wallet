import { Wallet } from 'ethers'
import { generateMnemonic, mnemonicToSeedSync, fromSeed } from '@rsksmart/rif-id-mnemonic'
import { getDPathByChainId } from '@rsksmart/rlogin-dpath'

type Mnemonic = string

type DerivedPaths = { [derivatoinPath: string]: boolean }

type LastDerivedAccountIndex = {
  [chainId: number]: number
}

type KeyManagementSystemState = {
  lastDerivedAccountIndex: LastDerivedAccountIndex
  derivedPaths: DerivedPaths
}

const createInitialState = (): KeyManagementSystemState => ({
  lastDerivedAccountIndex: {},
  derivedPaths: {}
})

type KeyManagementSystemSerialization = {
  mnemonic: Mnemonic
  state: KeyManagementSystemState
}

export type SaveableWallet = {
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
    const mnemonic = generateMnemonic(24)
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
   * @returns the KeyManagementSystem that was serialized
   */
  static fromSerialized (serialized: string): { kms: KeyManagementSystem, wallets: Wallet[] } {
    const { mnemonic, state }: KeyManagementSystemSerialization = JSON.parse(serialized)

    const kms = new KeyManagementSystem(mnemonic, state)
    const wallets = Object.keys(state.derivedPaths)
      .filter(derivedPath => state.derivedPaths[derivedPath])
      .map(derivedPath => kms.deriveWallet(derivedPath))

    return {
      kms,
      wallets
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
    return new Wallet(privateKey)
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

    const wallet = this.deriveWallet(derivationPath)

    return {
      derivationPath,
      wallet,
      save: () => {
        this.state.derivedPaths[derivationPath] = true
        this.state.lastDerivedAccountIndex[chainId] = this.state.lastDerivedAccountIndex[chainId] + 1
      }
    }
  }

  /**
   * Get tehe account for an arbitrary derivation path
   * @param derivationPath an arbitrary derivation path
   * @returns a savable wallet
   */
  addWallet (derivationPath: string): SaveableWallet {
    if (this.state.derivedPaths[derivationPath]) throw new Error('Existent wallet')

    const wallet = this.deriveWallet(derivationPath)

    return {
      derivationPath,
      wallet,
      save: () => {
        this.state.derivedPaths[derivationPath] = true
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
