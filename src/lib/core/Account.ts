import { Wallet, Signer } from 'ethers'
import { Provider, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider'
import { jsonRpcProvider } from '../jsonRpcProvider'

type QueuedTransaction = {
  id: number
  transactionRequest: TransactionRequest
  confirm: () => void
}

class Account extends Wallet {
  idCount: number
  queuedTransactions: QueuedTransaction[]

  constructor({ privateKey }: { privateKey: string }) {
    super(privateKey, jsonRpcProvider)
    this.idCount = 0
    this.queuedTransactions = []
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address)
  }

  async sendTransaction(transactionRequest: TransactionRequest): Promise<TransactionResponse> {
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

    const signedTransaction = super.sendTransaction(transactionRequest)

    return signedTransaction
  }
}

export default Account
