import { Wallet, Signer } from 'ethers'
import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { jsonRpcProvider } from '../jsonRpcProvider'
import { SmartWalletFactory } from './smartWallet/smart-wallet-factory'
import { SmartWallet } from './smartWallet/smart-wallet'

type QueuedTransaction = {
  id: number
  transactionRequest: TransactionRequest
  confirm: () => void
}

class Account extends Wallet {
  idCount: number = 0
  queuedTransactions: QueuedTransaction[]
  eoaWallet: Signer
  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory

  constructor({ privateKey, wallet, smartAddress, smartWalletFactory }: { privateKey: string, wallet: Signer, smartAddress: string, smartWalletFactory: SmartWalletFactory }) {
    super(privateKey, jsonRpcProvider)
    this.eoaWallet = wallet
    this.queuedTransactions = []
    this.smartWallet = new SmartWallet(smartAddress, wallet)
    this.smartWalletFactory = smartWalletFactory
  }

  static async create ({ privateKey }: { privateKey: string }) {
    const wallet = new Wallet(privateKey, jsonRpcProvider)
    const smartWalletFactory = new SmartWalletFactory(wallet)
    const smartAddress = await smartWalletFactory.getSmartAddress()
    return new Account({ privateKey, wallet, smartAddress, smartWalletFactory })
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

    const filteredTx = Object.keys(transactionRequest)
      .filter(key => !['to', 'data'].includes(key))
      .reduce((obj: any, key: any) => {
        obj[key] = (transactionRequest as any)[key];
        return obj;
      }, {});

    const signedTransaction = this.smartWallet.directExecute(transactionRequest.to, transactionRequest.data, filteredTx)

    return signedTransaction
  }
}

export default Account
