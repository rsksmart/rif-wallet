import { generateMnemonic, mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'
import { Account } from '.'
import { fromSeed } from 'bip32'

class Wallet {
  private mnemonic: string

  // creates the mnemonic
  constructor({ mnemonic }: { mnemonic: string }) {
    this.mnemonic = mnemonic
  }

  static create(): Wallet {
    const mnemonic = generateMnemonic(24)
    const wallet = new Wallet({ mnemonic })
    return wallet
  }

  getAccount(index: number) {
    const seed = mnemonicToSeedSync(this.mnemonic)
    const hdKey = fromSeed(seed).derivePath("m/44'/37310'/0'/0")
    const privateKey = hdKey.derive(index).privateKey!.toString('hex')
    return new Account({ privateKey })
  }
}

export default Wallet
