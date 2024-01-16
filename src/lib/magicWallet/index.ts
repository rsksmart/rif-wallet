import { Magic } from '@magic-sdk/react-native-bare'
import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { Bytes, providers, TypedDataDomain, TypedDataField } from 'ethers'
import { Deferrable, defineReadOnly } from 'ethers/lib/utils'

import {
  OnRequest,
  SendTransactionRequest,
  SignMessageRequest,
  SignTypedDataRequest,
} from '../eoaWallet'

export class MagicWallet extends Signer implements TypedDataSigner {
  private magic: Magic
  protected onRequest: OnRequest
  protected signer: providers.JsonRpcSigner
  public address: string

  constructor(
    magic: Magic,
    signer: providers.JsonRpcSigner,
    onRequest: OnRequest,
    address: string,
  ) {
    super()
    this.magic = magic
    this.signer = signer
    console.log('ON REQJEST', onRequest)
    this.onRequest = onRequest
    this.address = address

    defineReadOnly(this, 'provider', this.signer.provider)
  }

  async getAddress() {
    return this.signer.getAddress()
  }

  public static async create(
    email: string,
    magicInstance: Magic,
    onRequest: OnRequest,
  ) {
    const provider = await magicInstance.wallet.getProvider()
    const signer = new providers.Web3Provider(provider).getSigner()

    if (!(await magicInstance.user.isLoggedIn())) {
      await magicInstance.auth.loginWithEmailOTP({ email })
    }

    const address = await signer.getAddress()

    return new MagicWallet(magicInstance, signer, onRequest, address)
  }

  async sendTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<TransactionResponse> {
    // waits for confirm()

    const populatedTransaction = await this.populateTransaction(
      transactionRequest,
    )

    return new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<SendTransactionRequest>({
        type: 'sendTransaction',
        payload: transactionRequest,
        confirm: async () => {
          try {
            console.log('THIS>SIGNER', populatedTransaction)
            const obj = await this.signer.sendTransaction(populatedTransaction)
            resolve(obj)
            console.log('SEND IS CONFIRMED', obj)

            // resolve(obj)
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
            const string = await this.signer._signTypedData(
              domain,
              types,
              value,
            )
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
    console.log('SIGN MESSSAGE', message)
    return new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<SignMessageRequest>({
        type: 'signMessage',
        payload: message,
        confirm: async () => {
          try {
            const string = await this.signer.signMessage(message)
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

  signTransaction(_: Deferrable<TransactionRequest>) {
    return Promise.reject('Magic Wallet does not support signing')
  }

  connect(provider: providers.Provider): Signer {
    return this.signer.connect(provider)
  }

  async loginWithEmail(email: string) {
    try {
      console.log('EMAIL', email)
      const result = await this.magic.auth.loginWithEmailOTP({
        email,
        showUI: true,
      })

      return result
    } catch (err) {
      console.log('FAILED MAGIC EMAIL LOGIN', err)
    }

    return null
  }

  async loginWithPhone(phoneNumber: string) {
    try {
      const result = await this.magic.auth.loginWithSMS({ phoneNumber })

      return result
    } catch (err) {
      console.log('FAILED MAGIC PHONE LOGIN', err)
    }

    return null
  }
}
