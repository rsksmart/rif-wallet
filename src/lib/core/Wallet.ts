import { generateMnemonic, mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Account } from '.'
import { fromSeed } from 'bip32'
import { QueuedTransaction } from './Account'

class Wallet {
  private mnemonic: string
  private handleUxInteraction?: (
    qt: QueuedTransaction,
  ) => Promise<TransactionRequest>

  // creates the mnemonic
  constructor({
    mnemonic,
    handleUxInteraction,
  }: {
    mnemonic: string
    handleUxInteraction?: (qt: QueuedTransaction) => any
  }) {
    this.mnemonic = mnemonic
    this.handleUxInteraction = handleUxInteraction
  }

  static create(handleUxInteraction?: any): Wallet {
    // TODO: disengage
    const mnemonic = generateMnemonic(24)
    const wallet = new Wallet({ mnemonic, handleUxInteraction })
    return wallet
  }

  async getAccount(index: number): Promise<Account> {
    const seed = mnemonicToSeedSync(this.mnemonic)
    const hdKey = fromSeed(seed).derivePath("m/44'/37310'/0'/0")
    const privateKey =
      'c8e13a0e09736fe5d6e2a39113ba5c395b3747db1ea7abc0390a98a6dc8a00fc' //hdKey.derive(index).privateKey!.toString('hex')
    return await Account.create({
      privateKey,
      handleUxInteraction: this.handleUxInteraction,
    })
  }

  get getMnemonic() {
    return this.mnemonic
  }
}

export default Wallet
