import {
  BIP32Interface,
  generateMnemonic,
  mnemonicToSeed,
} from '@rsksmart/rif-id-mnemonic'
import { Account } from '.'
import { fromSeed } from 'bip32'

// testnet:
const seedToRSKTestnetHDKey: (seed: Buffer) => BIP32Interface = seed =>
  fromSeed(seed).derivePath("m/44'/37310'/0'/0")

class Wallet {
  private mnemonic: string
  private hdKey?: BIP32Interface
  isSetup: boolean

  accounts: {
    [key: string]: Account
  }

  // creates the mnemonic
  constructor() {
    this.mnemonic = ''
    this.accounts = {}
    this.isSetup = false

    this.hdKey
  }

  /**
   * Creates a new wallet using an existing mnemonic, or restores a wallet,
   * creates an HD key based on the TESTNET dev path
   */
  createWallet(mnemonic?: string) {
    if (this.mnemonic !== '') {
      throw 'Wallet has already been setup with a Mnemonic.'
    }

    this.mnemonic = mnemonic || generateMnemonic(12)

    // convert the seed to the HD Key
    mnemonicToSeed(this.mnemonic).then(
      (seed: Buffer) => (this.hdKey = seedToRSKTestnetHDKey(seed)),
    )

    this.isSetup = true
  }

  getAccount(network: 'RSK_TESTNET', path: number) {
    if (!this.hdKey) {
      throw 'HDKey has not been setup.'
    }
    const newAccount = new Account(
      network,
      `m/44'/37310'/0'/${path}`,
      this.hdKey.derive(path),
    )
    this.accounts[path] = newAccount
    return newAccount
  }

  getMnemonic(): string {
    return this.mnemonic
  }
}

export default Wallet
