import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { fromSeed, mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'
import {
  OnRequest,
  SendTransactionRequest,
  SignMessageRequest,
  SignTypedDataRequest,
} from '@rsksmart/rif-wallet-core'
import { getDPathByChainId } from '@rsksmart/rlogin-dpath'
import {
  Bytes,
  TypedDataDomain,
  TypedDataField,
  Wallet,
  providers,
} from 'ethers'

export type ChainID = 30 | 31

export interface WalletState {
  privateKey: string
  mnemonic?: string
}

export class EOAWallet extends Wallet {
  protected onRequest: OnRequest

  get isDeployed(): Promise<boolean> {
    return Promise.resolve(true)
  }

  protected constructor(
    privateKey: string,
    jsonRpcProvider: providers.JsonRpcProvider,
    onRequest: OnRequest,
  ) {
    super(privateKey, jsonRpcProvider)
    this.onRequest = onRequest
  }

  public static create(
    mnemonic: string,
    chainId: ChainID,
    jsonRpcProvider: providers.JsonRpcProvider,
    onRequest: OnRequest,
    cache?: (privateKey: string, mnemonic?: string) => void,
  ) {
    const seed = mnemonicToSeedSync(mnemonic)
    const derivationPath = getDPathByChainId(chainId, 0)
    const hdKey = fromSeed(seed).derivePath(derivationPath)
    const privateKey = hdKey.privateKey!.toString('hex')

    cache?.(privateKey, mnemonic)

    return new EOAWallet(privateKey, jsonRpcProvider, onRequest)
  }

  public static fromPrivateKey(
    privateKey: string,
    jsonRpcProvider: providers.JsonRpcProvider,
    onRequest: OnRequest,
  ) {
    return new EOAWallet(privateKey, jsonRpcProvider, onRequest)
  }

  async sendTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<TransactionResponse> {
    // waits for confirm()

    return new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<SendTransactionRequest>({
        type: 'sendTransaction',
        payload: [transactionRequest],
        returnType: {},
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
        returnType: '',
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
        payload: [message],
        returnType: '',
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
