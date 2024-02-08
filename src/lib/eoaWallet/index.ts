import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { TypedDataSigner } from '@ethersproject/abstract-signer'
import { fromSeed, mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'
import { RelayPayment } from '@rsksmart/rif-relay-light-sdk'
import { getDPathByChainId } from '@rsksmart/rlogin-dpath'
import {
  BigNumberish,
  Bytes,
  BytesLike,
  TypedDataDomain,
  TypedDataField,
  Wallet,
  providers,
} from 'ethers'

export type ChainID = 30 | 31
export type CacheFunction = (privateKey: string, mnemonic?: string) => void

export interface WalletState {
  privateKey: string
  mnemonic?: string
}

const generatePrivateKey = (mnemonic: string, chainId: ChainID) => {
  const seed = mnemonicToSeedSync(mnemonic)
  const derivationPath = getDPathByChainId(chainId, 0)
  const hdKey = fromSeed(seed).derivePath(derivationPath)
  const privateKey = hdKey.privateKey!.toString('hex')

  return privateKey
}

export type Request =
  | SendTransactionRequest
  | SignMessageRequest
  | SignTypedDataRequest
export type OnRequest = (request: Request) => void

export interface IncomingRequest<Type, Payload, ConfirmArgs> {
  type: Type
  payload: Payload
  confirm: (args?: ConfirmArgs) => Promise<void>
  reject: (reason?: any) => void
}

export type SignMessageRequest = IncomingRequest<'signMessage', BytesLike, void>

export interface OverriddableTransactionOptions {
  gasLimit: BigNumberish
  gasPrice: BigNumberish
  tokenPayment?: RelayPayment
  pendingTxsCount?: number
}

export type SendTransactionRequest = IncomingRequest<
  'sendTransaction',
  TransactionRequest,
  Partial<OverriddableTransactionOptions>
>

export type SignTypedDataArgs = Parameters<TypedDataSigner['_signTypedData']>

export type SignTypedDataRequest = IncomingRequest<
  'signTypedData',
  SignTypedDataArgs,
  void
>

export class EOAWallet extends Wallet {
  protected chainId: ChainID
  protected onRequest: OnRequest

  get isDeployed(): Promise<boolean> {
    return Promise.resolve(true)
  }

  protected constructor(
    privateKey: string,
    chainId: ChainID,
    jsonRpcProvider: providers.JsonRpcProvider,
    onRequest: OnRequest,
  ) {
    super(privateKey, jsonRpcProvider)
    this.chainId = chainId
    this.onRequest = onRequest
  }

  public static create(
    mnemonic: string,
    chainId: ChainID,
    jsonRpcProvider: providers.JsonRpcProvider,
    onRequest: OnRequest,
    cache?: CacheFunction,
  ) {
    const privateKey = generatePrivateKey(mnemonic, chainId)

    cache?.(privateKey, mnemonic)

    return new EOAWallet(privateKey, chainId, jsonRpcProvider, onRequest)
  }

  public static fromWalletState(
    keys: WalletState,
    chainId: ChainID,
    jsonRpcProvider: providers.JsonRpcProvider,
    onRequest: OnRequest,
  ) {
    let privateKey = keys.privateKey

    if (this.chainId !== chainId && keys.mnemonic) {
      privateKey = generatePrivateKey(keys.mnemonic, chainId)
    }

    return new EOAWallet(privateKey, chainId, jsonRpcProvider, onRequest)
  }

  async sendTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<TransactionResponse> {
    // waits for confirm()

    return new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<SendTransactionRequest>({
        type: 'sendTransaction',
        payload: transactionRequest,
        confirm: async () => {
          try {
            const obj = await super.sendTransaction(transactionRequest)

            resolve(obj)
          } catch (err) {
            reject(err)
          }
        },
        reject: (reason?: any) => {
          reject(new Error(reason))
        },
      })

      // emits onRequest with reference to the transactionRequest
      this.onRequest(nextRequest)
    })
  }

  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    value: Record<string, any>,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<SignTypedDataRequest>({
        type: 'signTypedData',
        payload: [domain, types, value],
        confirm: async () => {
          try {
            const string = await super._signTypedData(domain, types, value)
            resolve(string)
          } catch (err) {
            reject(err)
          }
        },
        reject: (reason?: any) => {
          reject(new Error(reason))
        },
      })

      // emits onRequest with reference to the signTypedDataRequest
      this.onRequest(nextRequest)
    })
  }

  signMessage(message: string | Bytes): Promise<string> {
    return new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<SignMessageRequest>({
        type: 'signMessage',
        payload: message,
        confirm: async () => {
          try {
            const string = await super.signMessage(message)
            resolve(string)
          } catch (err) {
            reject(err)
          }
        },
        reject: (reason?: any) => {
          reject(new Error(reason))
        },
      })

      // emits onRequest with reference to the signTypedDataRequest
      this.onRequest(nextRequest)
    })
  }
}
