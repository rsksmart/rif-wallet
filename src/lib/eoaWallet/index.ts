import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { fromSeed, mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'
import { OnRequest, SendTransactionRequest } from '@rsksmart/rif-wallet-core'
import { getDPathByChainId } from '@rsksmart/rlogin-dpath'
import { TypedDataDomain, TypedDataField, Wallet, providers } from 'ethers'
import { Bytes } from 'ethers/lib/utils'

type ChainID = 30 | 31

export interface WalletState {
  privateKey: string
  mnemonic?: string
}

export class EOAWallet extends Wallet {
  private onRequest: OnRequest

  private constructor(
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

  get isRelayWallet() {
    return false
  }

  get isSeedless() {
    return false
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
            console.log('OBJECT', obj)
            resolve(obj)
          } catch (err) {
            console.log('ERRORRED IN confirm', err)
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
    throw new Error('SIGNED TYPED DATA')
  }

  signMessage(message: string | Bytes): Promise<string> {
    throw new Error('MESSAGE TO BE SIGNED')
  }
}
