import { Signer, BigNumberish, BytesLike, constants, BigNumber, Transaction, ethers } from 'ethers'
import { TransactionRequest, Provider, TransactionResponse, BlockTag } from '@ethersproject/abstract-provider'
import { TypedDataSigner } from '@ethersproject/abstract-signer'
import { defineReadOnly } from '@ethersproject/properties'
import { Deferrable, resolveProperties } from 'ethers/lib/utils'
import SDK from '@jessgusclark/rsk-multi-token-sdk'

import { SmartWalletFactory } from './SmartWalletFactory'
import { SmartWallet } from './SmartWallet'
import { filterTxOptions } from './filterTxOptions'
import { relayTransaction, setupSDK } from '../relay-sdk/relayOperations'
import { RelayRequest } from '@jessgusclark/rsk-multi-token-sdk/dist/modules/typedRequestData'
import { RIFRelaySDK } from '../relay-sdk/RifRelaySdk'
import { getDomainSeparator, dataTypeFields } from '../relay-sdk/helpers'

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

    const sdk = await RIFRelaySDK.create(smartWallet, 31)

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

  /*
  // @todo rename to sendRelayedTransaction
  sendTransaction(transaction: Deferrable<any>): Promise<any> {
    console.log('sendTransaction', transaction)
    const payment = {
      tokenContract: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
      tokenAmount: '0'
    }

    return this.rifRelaySdk.createRelayRequest(transaction, payment)
      .then((response) => {
        const { relayRequest, domain, types } = response

        const onConfirm = (args: SignTypedDataArgs) =>
          // console.log('onConfirm', args)
          (this.smartWallet.signer as unknown as TypedDataSigner)
            ._signTypedData(...args)
              .then((signed: string) => {
                console.log('[RIF Wallet]', { signed, ...args })
                return signed
              })
        
              
        const request = this.createDoRequest(
          'signTypedData',
          onConfirm as CreateDoRequestOnConfirm
        ) as (...args: SignTypedDataArgs) => Promise<string>

        const value = {
          ...relayRequest.request,
          relayData: relayRequest.relayData,
        }
        return request(domain, types, value)
      })
  }
  */

  sendTransaction = this.createDoRequest(
    'sendTransaction',
    (([transactionRequest]: [TransactionRequest], overriddenOptions?: Partial<OverriddableTransactionOptions>) => {
      // check if attempting to send rBTC from the EOA account
      /*
      if (!transactionRequest.data && !!transactionRequest.value && !!transactionRequest.to) {
        return this.smartWallet.signer.sendTransaction({
          to: transactionRequest.to.toLowerCase(),
          value: transactionRequest.value
        })
      }
      */
     console.log('[RIFWallet sendTransaction:', {overriddenOptions})

      if (overriddenOptions && overriddenOptions.tokenPayment) {
        console.log('PAYING WITH TOKENS...', overriddenOptions.tokenPayment)
        this.rifRelaySdk.sendRelayRequest(transactionRequest, overriddenOptions.tokenPayment)
          .then((value: any) => {
            console.log('value or someshit...', value)
          })
        return 'hehe hoho'
      }

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
