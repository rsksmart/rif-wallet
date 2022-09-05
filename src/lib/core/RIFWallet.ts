import { Signer, BigNumberish, BytesLike, constants, BigNumber, Transaction, ethers, ContractTransaction } from 'ethers'
import { TransactionRequest, Provider, TransactionResponse, BlockTag } from '@ethersproject/abstract-provider'
import { TypedDataSigner } from '@ethersproject/abstract-signer'
import { defineReadOnly } from '@ethersproject/properties'
import { Deferrable, resolveProperties } from 'ethers/lib/utils'


import { SmartWalletFactory } from './SmartWalletFactory'
import { SmartWallet } from './SmartWallet'
import { filterTxOptions } from './filterTxOptions'
import { RIFRelaySDK } from '../relay-sdk/RifRelaySdk'
import { getDomainSeparator, dataTypeFields } from '../relay-sdk/helpers'
import { RelayPayment } from '../relay-sdk/types'

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
  tokenPayment?: {
    tokenContract: string,
    tokenAmount: string | number
  }
}

export type SendTransactionRequest = IRequest<
  'sendTransaction',
  [transactionRequest: TransactionRequest],
  TransactionResponse,
  Partial<OverriddableTransactionOptions>
>

export type SignMessageRequest = IRequest<
  'signMessage',
  [message: BytesLike],
  string,
  void
>

type SignTypedDataArgs = Parameters<TypedDataSigner['_signTypedData']>

export type SignTypedDataRequest = IRequest<
  'signTypedData',
  SignTypedDataArgs,
  string,
  void
>

export type Request = SendTransactionRequest | SignMessageRequest | SignTypedDataRequest
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
) => (...payload: RequestPayload) => Promise<RequestReturnType>

export class RIFWallet extends Signer implements TypedDataSigner {
  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory
  rifRelaySdk: RIFRelaySDK
  onRequest: OnRequest

  private constructor (smartWalletFactory: SmartWalletFactory, smartWallet: SmartWallet, onRequest: OnRequest, sdk: RIFRelaySDK) {
    super()
    this.smartWalletFactory = smartWalletFactory
    this.smartWallet = smartWallet
    this.onRequest = onRequest
    this.rifRelaySdk = sdk
    
    defineReadOnly(this, 'provider', this.smartWallet.signer.provider) // ref: https://github.com/ethers-io/ethers.js/blob/b1458989761c11bf626591706aa4ce98dae2d6a9/packages/abstract-signer/src.ts/index.ts#L130
  }

  get address (): string {
    return this.smartWallet.address
  }

  get smartWalletAddress (): string {
    return this.smartWallet.smartWalletAddress
  }

  static async create (signer: Signer, smartWalletFactoryAddress: string, onRequest: OnRequest) {
    const smartWalletFactory = await SmartWalletFactory.create(signer, smartWalletFactoryAddress)
    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()
    const smartWallet = await SmartWallet.create(signer, smartWalletAddress)

    const sdk = await RIFRelaySDK.create(smartWallet, smartWalletFactory, 31)

    return new RIFWallet(smartWalletFactory, smartWallet, onRequest, sdk)
  }

  // This needs to return the eoa address for T! RIF Relay's package to work:
  getAddress = (): Promise<string> => this.smartWallet.signer.getAddress()

  signTransaction = (transaction: TransactionRequest): Promise<string> => this.smartWallet.signer.signTransaction(transaction)

  // calls via smart wallet
  /*
  call (transactionRequest: TransactionRequest, blockTag?: BlockTag): Promise<any> {
    console.log('[RIFWallet] call()', transactionRequest)
    return this.smartWallet.callStaticDirectExecute(transactionRequest.to!, transactionRequest.data!, { ...filterTxOptions(transactionRequest), blockTag })
  }
  */

  createDoRequest: CreateDoRequest = (type, onConfirm) => {
    return (...payload) => new Promise((resolve, reject) => {
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

  deploySmartWallet = (payment: RelayPayment) => {
    console.log('DEPLOY SMART WALLET FROM RIFWALLET')
    return this.rifRelaySdk.sendDeployTransaction(payment)
  }

  sendTransaction = this.createDoRequest(
    'sendTransaction',
    (([transactionRequest]: [TransactionRequest], overriddenOptions?: Partial<OverriddableTransactionOptions>) => {
      // check if attempting to send rBTC from the EOA account and paying with gas:
      if (!transactionRequest.data && !!transactionRequest.value && !!transactionRequest.to && !overriddenOptions?.tokenPayment) {
        return this.smartWallet.signer.sendTransaction({
          to: transactionRequest.to.toLowerCase(),
          value: transactionRequest.value
        })
      }

      // check if paying with tokens:
      if (overriddenOptions && overriddenOptions.tokenPayment) {
        return this.rifRelaySdk.sendRelayTransaction(transactionRequest, overriddenOptions.tokenPayment)
      }

      // direct execute transaction paying gas with EOA wallet:
      const txOptions = {
        ...filterTxOptions(transactionRequest),
        ...overriddenOptions || {}
      }

      return this.smartWallet.directExecute(transactionRequest.to!, transactionRequest.data ?? constants.HashZero, txOptions)      
    }) as CreateDoRequestOnConfirm
  ) as (transactionRequest: TransactionRequest) => Promise<TransactionResponse>


  signMessage = this.createDoRequest(
    'signMessage',
    (([message]: [BytesLike]) => this.smartWallet.signer.signMessage(message)) as CreateDoRequestOnConfirm
  ) as (message: BytesLike) => Promise<string>

  _signTypedData = this.createDoRequest(
    'signTypedData',
    ((args: SignTypedDataArgs) => (this.smartWallet.signer as any as TypedDataSigner)._signTypedData(...args)) as CreateDoRequestOnConfirm
  ) as (...args: SignTypedDataArgs) => Promise<string>


  estimateGas (transaction: TransactionRequest): Promise<BigNumber> {
    return resolveProperties(this.checkTransaction(transaction))
      .then((tx: TransactionRequest) => this.smartWallet.estimateDirectExecute(
        tx.to || constants.AddressZero,
        tx.data || constants.HashZero,
        filterTxOptions(tx)
      ))
  }

  connect = (provider: Provider): Signer => {
    throw new Error('Method not implemented')
  }
}
