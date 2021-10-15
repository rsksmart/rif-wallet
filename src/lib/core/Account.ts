import { Wallet, Signer } from 'ethers'
import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { jsonRpcProvider } from '../jsonRpcProvider'
import { SmartWalletFactory } from './smartWallet/smart-wallet-factory'
import { SmartWallet } from './smartWallet/smart-wallet'

export type QueuedTransaction = {
  id: number
  transactionRequest: TransactionRequest
  confirm: (userApprovedTransaction: TransactionRequest) => void
  cancel: () => void
}

class Account extends Wallet {
  idCount: number = 0
  queuedTransactions: QueuedTransaction[]
  eoaWallet: Signer
  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory
  handleUxInteraction: (qt: QueuedTransaction) => Promise<TransactionRequest>

  constructor({
    privateKey,
    wallet,
    smartAddress,
    smartWalletFactory,
    handleUxInteraction,
  }: {
    privateKey: string
    wallet: Signer
    smartAddress: string
    smartWalletFactory: SmartWalletFactory
    handleUxInteraction: (qt: QueuedTransaction) => Promise<TransactionRequest>
  }) {
    super(privateKey, jsonRpcProvider)
    this.eoaWallet = wallet
    this.queuedTransactions = []
    this.smartWallet = new SmartWallet(smartAddress, wallet)
    this.smartWalletFactory = smartWalletFactory
    this.handleUxInteraction = handleUxInteraction
  }

  static async create({
    privateKey,
    handleUxInteraction,
  }: {
    privateKey: string
    handleUxInteraction: (qt: QueuedTransaction) => Promise<TransactionRequest>
  }) {
    const wallet = new Wallet(privateKey, jsonRpcProvider)
    const smartWalletFactory = new SmartWalletFactory(wallet)
    const smartAddress = await smartWalletFactory.getSmartAddress()
    return new Account({
      privateKey,
      wallet,
      smartAddress,
      smartWalletFactory,
      handleUxInteraction,
    })
  }

  nextTransaction(): QueuedTransaction {
    if (this.queuedTransactions.length === 0) {
      throw new Error()
    }
    return this.queuedTransactions[0]
  }

  getSmartAddress(): Promise<string> {
    return Promise.resolve(this.smartWallet.smartWalletContract.address)
  }

  deploy = () => this.smartWalletFactory.createSmartWallet()

  async sendTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<TransactionResponse> {
    // here we queue the transaction
    const id = this.idCount++

    return await new Promise(
      (
        resolve: (t: TransactionRequest) => void,
        reject: (error: Error) => void,
      ) => {
        const queuedTransaction = {
          id,
          transactionRequest,
          confirm: (userConfirmedTransaction: TransactionRequest) =>
            resolve(userConfirmedTransaction),
          cancel: () => reject(Error('User rejected the transaction')),
        }
        this.queuedTransactions.push(queuedTransaction)

        // Pass transaction to the UI for the user's confirm or cancel:
        this.handleUxInteraction(queuedTransaction)
      },
    )
      // transaction with user modified gasPrice/gasLimit:
      .then((userConfirmedTransaction: TransactionRequest) => {
        console.log('userConfirmedTransaction', userConfirmedTransaction)
        // assumes the transactions are confirmed in order
        // because the confirm() is only found using nextTransaction()
        this.queuedTransactions.shift()

        const filteredTx = Object.keys(userConfirmedTransaction)
          .filter(key => !['to', 'data'].includes(key))
          .reduce((obj: any, key: any) => {
            obj[key] = (userConfirmedTransaction as any)[key]
            return obj
          }, {})

        const signedTransaction = this.smartWallet.directExecute(
          userConfirmedTransaction.to,
          userConfirmedTransaction.data,
          filteredTx,
        )

        console.log('directExecute tx:', userConfirmedTransaction)

        return signedTransaction
      })
      // user has rejected the transaction:
      .catch((err: Error) => {
        this.queuedTransactions.shift()
        // Return error to the _thing_ that is calling this
        throw err
      })
  }
}

export default Account
