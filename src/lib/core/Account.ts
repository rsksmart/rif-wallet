import { Wallet } from 'ethers'
import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
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

  nextTransaction(): QueuedTransaction {
    if (this.queuedTransactions.length === 0) {
      throw new Error()
    }
    return this.queuedTransactions[0]
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address.toLowerCase())
  }

  async sendTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<TransactionResponse> {
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
