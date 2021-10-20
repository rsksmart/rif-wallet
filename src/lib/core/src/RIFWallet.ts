import {
  TransactionRequest,
  Provider,
  TransactionResponse,
  BlockTag,
} from '@ethersproject/abstract-provider'
import { Bytes, Signer, Wallet, BigNumber } from 'ethers'
import { SmartWalletFactory } from './SmartWalletFactory'
import { SmartWallet } from './SmartWallet'

const filterTxOptions = (transactionRequest: TransactionRequest) =>
  Object.keys(transactionRequest)
    .filter(key => !['to', 'data'].includes(key))
    .reduce((obj: any, key: any) => {
      obj[key] = (transactionRequest as any)[key]
      return obj
    }, {})

export type Request = {
  type: 'sendTransaction'
  payload: {
    transactionRequest: TransactionRequest
  }
  confirm: (value?: any) => void
  reject: (reason?: any) => void
}

type OnRequest = (request: Request) => void

export class RIFWallet extends Signer {
  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory
  pendingRequest?: Request
  onRequest: OnRequest

  private constructor(
    smartWalletFactory: SmartWalletFactory,
    smartWallet: SmartWallet,
    onRequest: OnRequest,
  ) {
    super()
    this.smartWalletFactory = smartWalletFactory
    this.smartWallet = smartWallet
    this.onRequest = onRequest
  }

  get address(): string {
    return this.smartWallet.smartWalletAddress
  }

  get smartWalletAddress(): string {
    return this.smartWallet.smartWalletAddress
  }

  get wallet(): Wallet {
    return this.smartWallet.wallet
  }

  static async create(
    wallet: Wallet,
    smartWalletFactoryAddress: string,
    onRequest: OnRequest,
  ) {
    const smartWalletFactory = await SmartWalletFactory.create(
      wallet,
      smartWalletFactoryAddress,
    )
    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()
    const smartWallet = SmartWallet.create(wallet, smartWalletAddress)
    return new RIFWallet(smartWalletFactory, smartWallet, onRequest)
  }

  getAddress = (): Promise<string> =>
    Promise.resolve(this.smartWallet.smartWalletAddress)

  signMessage = (message: string | Bytes): Promise<string> =>
    this.smartWallet.wallet.signMessage(message)
  signTransaction = (transaction: TransactionRequest): Promise<string> =>
    this.smartWallet.wallet.signTransaction(transaction)

  // should override estimating via directExecute
  estimateGas(transaction: TransactionRequest): Promise<BigNumber> {
    return this.smartWallet.wallet.estimateGas(transaction)
  }

  // should override calling via directExecute
  call(transaction: TransactionRequest, _blockTag?: BlockTag): Promise<string> {
    return this.smartWallet.wallet.call(transaction)
  }

  async sendTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<TransactionResponse> {
    if (this.pendingRequest) {
      throw new Error('Pending transaction')
    }

    // queues the transaction
    await new Promise((resolve, reject) => {
      this.pendingRequest = Object.freeze({
        type: 'sendTransaction',
        payload: {
          transactionRequest,
        },
        confirm: (value?: any) => {
          delete this.pendingRequest
          resolve(value)
        },
        reject: (_reason?: any) => {
          delete this.pendingRequest
          reject(new Error('Rejected'))
        },
      })

      this.onRequest(this.pendingRequest)
    })

    return await this.smartWallet.directExecute(
      transactionRequest.to!,
      transactionRequest.data!,
      filterTxOptions(transactionRequest),
    )
  }

  nextRequest(): Request {
    if (!this.pendingRequest) {
      throw new Error('No next request')
    }
    return this.pendingRequest
  }

  connect = (_provider: Provider): Signer => {
    throw new Error('Method not implemented')
  }
}
