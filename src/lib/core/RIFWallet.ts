import { Bytes, Signer, Wallet, BigNumberish } from 'ethers'
import { TransactionRequest, Provider, TransactionResponse, BlockTag } from '@ethersproject/abstract-provider'
import { defineReadOnly } from '@ethersproject/properties'
import { SmartWalletFactory } from './SmartWalletFactory'
import { SmartWallet } from './SmartWallet'
import { filterTxOptions } from './filterTxOptions'

export type OverriddableTransactionOptions = {
  gasLimit: BigNumberish,
  gasPrice: BigNumberish,
}

export interface Request {
  type: string
  payload: { transactionRequest: TransactionRequest } | string | Bytes
  confirm: (params?: {}) => void
  reject: (reason?: {}) => void
}

export interface SendTransactionRequest extends Request {
  type: 'sendTransaction',
  payload: {
    // needs refactor: payload can be transactionRequest, not an object of transactionRequest
    transactionRequest: TransactionRequest
  },
  confirm: (value?: Partial<OverriddableTransactionOptions>) => void
}

export interface SignMessageRequest extends Request {
  type: 'signMessage',
  payload: string | Bytes
}

export type OnRequest = (request: Request) => void

export class RIFWallet extends Signer {
  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory
  onRequest: OnRequest

  private constructor (smartWalletFactory: SmartWalletFactory, smartWallet: SmartWallet, onRequest: OnRequest) {
    super()
    this.smartWalletFactory = smartWalletFactory
    this.smartWallet = smartWallet
    this.onRequest = onRequest

    defineReadOnly(this, 'provider', this.smartWallet.wallet.provider) // ref: https://github.com/ethers-io/ethers.js/blob/b1458989761c11bf626591706aa4ce98dae2d6a9/packages/abstract-signer/src.ts/index.ts#L130
  }

  get address (): string {
    return this.smartWallet.smartWalletAddress
  }

  get smartWalletAddress (): string {
    return this.smartWallet.smartWalletAddress
  }

  get wallet (): Wallet {
    return this.smartWallet.wallet
  }

  static async create (wallet: Wallet, smartWalletFactoryAddress: string, onRequest: OnRequest) {
    const smartWalletFactory = await SmartWalletFactory.create(wallet, smartWalletFactoryAddress)
    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()
    const smartWallet = SmartWallet.create(wallet, smartWalletAddress)
    return new RIFWallet(smartWalletFactory, smartWallet, onRequest)
  }

  getAddress = (): Promise<string> => Promise.resolve(this.smartWallet.smartWalletAddress)

  async signMessage (message: string | Bytes): Promise<string> {
    return await new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<SignMessageRequest>({
        type: 'signMessage',
        payload: message,
        confirm: async () => resolve(await this.smartWallet.wallet.signMessage(message)),
        reject: (reason?: any) => reject(new Error(reason))
      })

      // emits onRequest
      this.onRequest(nextRequest)
    })
  }

  signTransaction = (transaction: TransactionRequest): Promise<string> => this.smartWallet.wallet.signTransaction(transaction)

  // calls via smart wallet
  call (transactionRequest: TransactionRequest, blockTag?: BlockTag): Promise<any> {
    return this.smartWallet.callStaticDirectExecute(transactionRequest.to!, transactionRequest.data!, { ...filterTxOptions(transactionRequest), blockTag })
  }

  async sendTransaction (transactionRequest: TransactionRequest): Promise<TransactionResponse> {
    // waits for confirm()
    return await new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<SendTransactionRequest>({
        type: 'sendTransaction',
        payload: {
          transactionRequest
        },
        confirm: async (overriddenOptions?: Partial<OverriddableTransactionOptions>) => {
          const txOptions = {
            ...filterTxOptions(transactionRequest),
            ...overriddenOptions || {}
          }

          resolve(await this.smartWallet.directExecute(transactionRequest.to!, transactionRequest.data!, txOptions))
        },
        reject: (reason?: any) => {
          reject(new Error(reason))
        }
      })

      // emits onRequest with reference to the transactionRequest
      this.onRequest(nextRequest)
    })
  }

  connect = (provider: Provider): Signer => {
    throw new Error('Method not implemented')
  }
}
