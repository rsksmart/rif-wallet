import {
  BIP32Interface,
  generateMnemonic,
  mnemonicToSeed,
} from '@rsksmart/rif-id-mnemonic'
import { Account } from '.'
import { fromSeed } from 'bip32'

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

    // convert the seed to the HD Key for testnet
    mnemonicToSeed(this.mnemonic).then(
      (seed: Buffer) =>
        (this.hdKey = fromSeed(seed).derivePath("m/44'/37310'/0'/0")),
    )

    console.log(this.mnemonic)
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
