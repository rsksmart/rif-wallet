import { Wallet, Signer, Bytes } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/abstract-provider'

type QueuedTransaction = {
  id: number
  transactionRequest: TransactionRequest
  confirm: () => void
}

class Account extends Signer {
  wallet: Wallet

  idCount: number
  queuedTransactions: QueuedTransaction[]

  get privateKey() {
    return this.wallet.privateKey
  }

  get address() {
    return this.wallet.address.toLowerCase()
  }

  constructor({ privateKey }: { privateKey: string }) {
    super()
    this.wallet = new Wallet(privateKey)
    this.idCount = 0
    this.queuedTransactions = []
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address)
  }

  // Returns the signed prefixed-message. This MUST treat:
  // - Bytes as a binary message
  // - string as a UTF8-message
  // i.e. "0x1234" is a SIX (6) byte string, NOT 2 bytes of data
  signMessage(message: Bytes | string): Promise<string> {
    // this method is used only for direct signing messages
    // ethers.js is not using this method in contracts or transactions
    // we can proxy to the wallet and build the ux on top of it
    return this.wallet.signMessage(message)
  }

  nextTransaction(): QueuedTransaction {
    if (this.queuedTransactions.length === 0) {
      throw new Error()
    }
    return this.queuedTransactions[0]
  }

  // Signs a transaxction and returns the fully serialized, signed transaction.
  // The EXACT transaction MUST be signed, and NO additional properties to be added.
  // - This MAY throw if signing transactions is not supports, but if
  //   it does, sentTransaction MUST be overridden.
  async signTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<string> {
    // here we queue the transaction
    const id = this.idCount++
    await new Promise((resolve: (reason?: any) => void) => {
      const queuedTransaction = {
        id,
        transactionRequest,
        confirm: () => resolve(),
      }
      this.queuedTransactions.push(queuedTransaction)
      // ux happens here
    })

    // assumes the transactions are confirmed in order
    // because the confirm() is only found using nextTransaction()
    this.queuedTransactions.shift()

    const signedTransaction = this.wallet.signTransaction(transactionRequest)

    return signedTransaction
  }

  // Returns a new instance of the Signer, connected to provider.
  // This MAY throw if changing providers is not supported.
  connect(_provider: Provider): Signer {
    throw new Error()
  }
}

export default Account
