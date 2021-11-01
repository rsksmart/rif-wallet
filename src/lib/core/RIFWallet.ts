import { Signer, Wallet, BigNumberish, BytesLike } from 'ethers'
import { TransactionRequest, Provider, TransactionResponse, BlockTag } from '@ethersproject/abstract-provider'
import { defineReadOnly } from '@ethersproject/properties'
import { SmartWalletFactory } from './SmartWalletFactory'
import { SmartWallet } from './SmartWallet'
import { filterTxOptions } from './filterTxOptions'

type IRequest<Type, Payload, ReturnType, ConfirmArgs> = {
  type: Type,
  payload: Payload
  returnType: ReturnType
  confirm: (args?: ConfirmArgs) => Promise<void>
  reject: (reason?: any) => void
}

export type OverriddableTransactionOptions = {
  gasLimit: BigNumberish,
  gasPrice: BigNumberish,
}

export type SendTransactionRequest = IRequest<
  'sendTransaction',
  TransactionRequest,
  TransactionResponse,
  Partial<OverriddableTransactionOptions>
>

export type SignMessageRequest = IRequest<
  'signMessage',
  BytesLike,
  string,
  void
>

export type Request = SendTransactionRequest | SignMessageRequest
export type OnRequest = (request: Request) => void

type RequestType = Request['type']
type RequestPayload = Request['payload']
type RequestReturnType = Request['returnType']
type RequestConfirm = Request['confirm']

type RequestConfirmOverrides = Parameters<RequestConfirm>[0]

type CreateDoRequestOnConfirm = (payload: RequestPayload, overrides: RequestConfirmOverrides) => Promise<RequestReturnType>

type CreateDoRequest = (
  type: RequestType,
  onConfirm: CreateDoRequestOnConfirm
) => (payload: RequestPayload) => Promise<RequestReturnType>

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

  signTransaction = (transaction: TransactionRequest): Promise<string> => this.smartWallet.wallet.signTransaction(transaction)

  // calls via smart wallet
  call (transactionRequest: TransactionRequest, blockTag?: BlockTag): Promise<any> {
    return this.smartWallet.callStaticDirectExecute(transactionRequest.to!, transactionRequest.data!, { ...filterTxOptions(transactionRequest), blockTag })
  }

  createDoRequest: CreateDoRequest = (type, onConfirm) => {
    return (payload) => new Promise((resolve, reject) => {
      const nextRequest = Object.freeze({
        type,
        payload,
        confirm: (args?: RequestConfirmOverrides) => resolve(onConfirm(payload, args)),
        reject
      })

      // emits onRequest
      this.onRequest(nextRequest as Request)
    })
  }

  sendTransaction = this.createDoRequest(
    'sendTransaction',
    ((transactionRequest: TransactionRequest, overriddenOptions?: Partial<OverriddableTransactionOptions>) => {
      const txOptions = {
        ...filterTxOptions(transactionRequest),
        ...overriddenOptions || {}
      }

      return this.smartWallet.directExecute(transactionRequest.to!, transactionRequest.data!, txOptions)
    }) as CreateDoRequestOnConfirm
  ) as (transactionRequest: TransactionRequest) => Promise<TransactionResponse>

  signMessage = this.createDoRequest(
    'signMessage',
    ((message: BytesLike) => this.smartWallet.wallet.signMessage(message)) as CreateDoRequestOnConfirm
  ) as (message: BytesLike) => Promise<string>

  connect = (provider: Provider): Signer => {
    throw new Error('Method not implemented')
  }
}
