import { generateMnemonic, mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Account } from '.'
import { fromSeed } from 'bip32'
import { QueuedTransaction } from './Account'

class Wallet {
  private mnemonic: string
  private handleUxInteraction: (
    qt: QueuedTransaction,
  ) => Promise<TransactionRequest>

  // creates the mnemonic
  constructor({
    mnemonic,
    handleUxInteraction,
  }: {
    mnemonic: string
    handleUxInteraction: (qt: QueuedTransaction) => any
  }) {
    this.mnemonic = mnemonic
    this.handleUxInteraction = handleUxInteraction
  }

  static create(handleUxInteraction: any): Wallet {
    const mnemonic = generateMnemonic(24)
    const wallet = new Wallet({ mnemonic, handleUxInteraction })
    return wallet
  }

  async getAccount(index: number) {
    const seed = mnemonicToSeedSync(this.mnemonic)
    const hdKey = fromSeed(seed).derivePath("m/44'/37310'/0'/0")
    const privateKey = hdKey.derive(index).privateKey!.toString('hex')
    return Account.create({
      privateKey,
      handleUxInteraction: this.handleUxInteraction,
    })
  }

  get getMnemonic() {
    return this.mnemonic
  }
}

export default Wallet
