import {
  RIFRelaySDK,
  RelayPayment,
  RifRelayConfig,
} from '@rsksmart/rif-relay-light-sdk'
import { Magic } from '@magic-sdk/react-native-bare'
import {
  JsonRpcSigner,
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/providers'
import { BlockchainAuthenticatorConfig } from '@json-rpc-tools/utils'
import { defineReadOnly } from 'ethers/lib/utils'

import { MagicWallet } from '../magicWallet'
import { OnRequest, SendTransactionRequest } from '../eoaWallet'

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

export class MagicRelayWallet extends MagicWallet {
  rifRelaySdk: RIFRelaySDK

  get isDeployed() {
    return this.rifRelaySdk.smartWalletFactory.isDeployed()
  }

  get smartWalletAddress(): string {
    return this.rifRelaySdk.smartWallet.smartWalletAddress
  }

  constructor(
    magic: Magic,
    signer: JsonRpcSigner,
    onRequest: OnRequest,
    address: string,
    rifRelaySdk: RIFRelaySDK,
  ) {
    super(magic, signer, onRequest, address)
    this.rifRelaySdk = rifRelaySdk

    defineReadOnly(this, 'provider', this.provider)
  }

  public static async create(
    email: string,
    magicInstance: Magic,
    onRequest: OnRequest,
    config: RifRelayConfig,
  ) {
    try {
      const wallet = await super.create(email, magicInstance, onRequest)

      if (!wallet) {
        throw new Error('Failed to create Magic Wallet')
      }

      // bypass the EOAWallet's _signTypedData since the consent is already given
      // wallet._signTypedData = (domain, types, value) => {
      //   return wallet._signTypedData
      // }

      const rifRelaySdk = await RIFRelaySDK.create(wallet, config)

      return new MagicRelayWallet(
        magicInstance,
        wallet.signer,
        onRequest,
        wallet.address,
        rifRelaySdk,
      )
    } catch (err) {
      console.log('ERROR CREATING MAGIC WALLET', err)
      return null
    }
  }

  // calls via smart wallet
  call(
    transactionRequest: TransactionRequest,
    blockTag?: BlockchainAuthenticatorConfig,
  ): Promise<any> {
    return this.rifRelaySdk.smartWallet.callStaticDirectExecute(
      transactionRequest.to!,
      transactionRequest.data!,
      { ...filterTxOptions(transactionRequest), blockTag },
    )
  }

  deploySmartWallet = (payment: RelayPayment) =>
    this.rifRelaySdk.sendDeployTransaction(payment)

  override estimateGas(txRequest: TransactionRequest, tokenContract?: string) {
    if (tokenContract) {
      console.log('ESTImATE TX COST MAGIC', tokenContract)
      return this.rifRelaySdk.estimateTransactionCost(txRequest, tokenContract)
    }

    return super.estimateGas(txRequest)
  }

  sendTransaction(
    transactionRequest: TransactionRequest,
  ): Promise<TransactionResponse> {
    return new Promise((resolve, reject) => {
      const nextRequest = Object.freeze<SendTransactionRequest>({
        type: 'sendTransaction',
        payload: transactionRequest,
        confirm: async overriddenOptions => {
          // check if paying with tokens:
          if (overriddenOptions && overriddenOptions.tokenPayment) {
            console.log('sendRelayTransaction', transactionRequest)
            return resolve(
              await this.rifRelaySdk.sendRelayTransaction(
                {
                  ...transactionRequest,
                  gasPrice: overriddenOptions.gasPrice,
                  gasLimit: overriddenOptions.gasLimit,
                },
                overriddenOptions.tokenPayment,
              ),
            )
          }

          // direct execute transaction paying gas with EOA wallet:
          const txOptions = {
            ...filterTxOptions(transactionRequest),
            ...(overriddenOptions || {}),
          }

          console.log('txOptions', txOptions)

          return resolve(
            await this.rifRelaySdk.smartWallet.directExecute(
              transactionRequest.to!,
              transactionRequest.data ?? HashZero,
              txOptions,
            ),
          )
        },
        reject,
      })

      // emits onRequest
      this.onRequest(nextRequest)
    })
  }
}
