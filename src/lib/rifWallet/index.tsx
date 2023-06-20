import {
  TransactionRequest,
  Provider,
  TransactionResponse,
  BlockTag,
} from '@ethersproject/abstract-provider'
import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { defineReadOnly, resolveProperties } from '@ethersproject/properties'
import { BigNumber } from '@ethersproject/bignumber'
import { BytesLike } from '@ethersproject/bytes'
import {
  RIFRelaySDK,
  RelayPayment,
  RifRelayConfig,
  SmartWalletFactory,
  SmartWallet,
} from '@rsksmart/rif-relay-light-sdk'

// import {
//   OverriddableTransactionOptions,
//   Request,
//   OnRequest,
//   SignTypedDataArgs,
// } from './types'

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const HashZero =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

const filterTxOptions = (transactionRequest: TransactionRequest) =>
  Object.keys(transactionRequest)
    .filter(key => !['from', 'to', 'data'].includes(key))
    .reduce((obj: any, key: any) => {
      obj[key] = (transactionRequest as any)[key]
      return obj
    }, {})

type RequestType = Request['type']
type RequestPayload = Request['payload']
type RequestReturnType = Request['returnType']
type RequestConfirm = Request['confirm']

type RequestConfirmOverrides = Parameters<RequestConfirm>[0]

type CreateDoRequestOnConfirm = (
  payload: RequestPayload,
  overrides: RequestConfirmOverrides,
) => Promise<RequestReturnType>

type CreateDoRequest = (
  type: RequestType,
  onConfirm: CreateDoRequestOnConfirm,
) => (...payload: RequestPayload) => Promise<RequestReturnType>

export class RIFMagicWallet extends Signer implements TypedDataSigner {
  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory
  rifRelaySdk: RIFRelaySDK
  onRequest: OnRequest

  private constructor(sdk: RIFRelaySDK, onRequest: OnRequest) {
    super()
    console.log('SDK', sdk)
    this.smartWalletFactory = sdk.smartWalletFactory
    this.smartWallet = sdk.smartWallet
    this.onRequest = onRequest
    this.rifRelaySdk = sdk

    defineReadOnly(this, 'provider', this.smartWallet.signer.provider) // ref: https://github.com/ethers-io/ethers.js/blob/b1458989761c11bf626591706aa4ce98dae2d6a9/packages/abstract-signer/src.ts/index.ts#L130
  }

  get address(): string {
    return this.smartWallet.address
  }

  get smartWalletAddress(): string {
    console.log('SMART WALLET ADDRESS', this)
    return this.smartWallet.smartWalletAddress
  }

  static async create(
    signer: Signer,
    onRequest: OnRequest,
    rifRelayConfig: RifRelayConfig,
  ) {
    const address = await signer.getAddress()
    console.log('ADDRESS', address)
    const sdk = await RIFRelaySDK.create(signer, rifRelayConfig)
    console.log('SDK', sdk)
    return new RIFMagicWallet(sdk, onRequest)
  }

  getAddress = (): Promise<string> => {
    console.log('RIF WALLET ADDRESS', this.smartWallet.smartWalletAddress)
    return Promise.resolve(this.smartWallet.smartWalletAddress)
  }

  signTransaction = (transaction: TransactionRequest): Promise<string> =>
    this.smartWallet.signer.signTransaction(transaction)

  // calls via smart wallet
  call(
    transactionRequest: TransactionRequest,
    blockTag?: BlockTag,
  ): Promise<any> {
    return this.smartWallet.callStaticDirectExecute(
      transactionRequest.to!,
      transactionRequest.data!,
      { ...filterTxOptions(transactionRequest), blockTag },
    )
  }

  createDoRequest: CreateDoRequest = (type, onConfirm) => {
    return (...payload) =>
      new Promise((resolve, reject) => {
        const nextRequest = Object.freeze({
          type,
          payload,
          confirm: (args?: RequestConfirmOverrides) =>
            resolve(onConfirm(payload, args)),
          reject,
        })

        // emits onRequest
        this.onRequest(nextRequest as Request)
      })
  }

  deploySmartWallet = (payment: RelayPayment) =>
    this.rifRelaySdk.sendDeployTransaction(payment)

  sendTransaction = this.createDoRequest('sendTransaction', ((
    [transactionRequest]: [TransactionRequest],
    overriddenOptions?: Partial<OverriddableTransactionOptions>,
  ) => {
    // check if attempting to send rBTC from the EOA account and paying with gas:
    if (
      !transactionRequest.data &&
      !!transactionRequest.value &&
      !!transactionRequest.to &&
      !overriddenOptions?.tokenPayment
    ) {
      return this.smartWallet.signer.sendTransaction({
        to: transactionRequest.to.toLowerCase(),
        value: transactionRequest.value,
      })
    }

    // check if paying with tokens:
    if (overriddenOptions && overriddenOptions.tokenPayment) {
      return this.rifRelaySdk.sendRelayTransaction(
        {
          ...transactionRequest,
          gasPrice: overriddenOptions.gasPrice,
          gasLimit: overriddenOptions.gasLimit,
        },
        overriddenOptions.tokenPayment,
      )
    }

    // direct execute transaction paying gas with EOA wallet:
    const txOptions = {
      ...filterTxOptions(transactionRequest),
      ...(overriddenOptions || {}),
    }

    return this.smartWallet.directExecute(
      transactionRequest.to!,
      transactionRequest.data ?? HashZero,
      txOptions,
    )
  }) as CreateDoRequestOnConfirm) as (
    transactionRequest: TransactionRequest,
  ) => Promise<TransactionResponse>

  signMessage = this.createDoRequest('signMessage', (([message]: [BytesLike]) =>
    this.smartWallet.signer.signMessage(
      message,
    )) as CreateDoRequestOnConfirm) as (message: BytesLike) => Promise<string>

  _signTypedData = this.createDoRequest('signTypedData', ((
    args: SignTypedDataArgs,
  ) =>
    (this.smartWallet.signer as any as TypedDataSigner)._signTypedData(
      ...args,
    )) as CreateDoRequestOnConfirm) as (
    ...args: SignTypedDataArgs
  ) => Promise<string>

  estimateGas(transaction: TransactionRequest): Promise<BigNumber> {
    return resolveProperties(this.checkTransaction(transaction)).then(
      (tx: TransactionRequest) =>
        this.smartWallet.estimateDirectExecute(
          tx.to || AddressZero,
          tx.data || HashZero,
          filterTxOptions(tx),
        ),
    )
  }

  connect = (_provider: Provider): Signer => {
    throw new Error('Method not implemented')
  }
}
