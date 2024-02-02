import {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import {
  RIFRelaySDK,
  RelayPayment,
  RifRelayConfig,
} from '@rsksmart/rif-relay-light-sdk'
import { Wallet, providers } from 'ethers'
import { BlockchainAuthenticatorConfig } from '@json-rpc-tools/utils'
import { defineReadOnly } from 'ethers/lib/utils'

import {
  ChainID,
  EOAWallet,
  OnRequest,
  SendTransactionRequest,
  WalletState,
} from '../eoaWallet'

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

export class RelayWallet extends EOAWallet {
  public rifRelaySdk: RIFRelaySDK

  get isDeployed(): Promise<boolean> {
    return this.rifRelaySdk.smartWalletFactory.isDeployed()
  }

  get smartWalletAddress(): string {
    return this.rifRelaySdk.smartWallet.smartWalletAddress
  }

  protected constructor(
    privateKey: string,
    chainId: ChainID,
    jsonRpcProvider: providers.JsonRpcProvider,
    sdk: RIFRelaySDK,
    onRequest: OnRequest,
  ) {
    super(privateKey, chainId, jsonRpcProvider, onRequest)
    this.rifRelaySdk = sdk

    defineReadOnly(this, 'provider', this.provider)
  }

  public static async create(
    mnemonic: string,
    chainId: ChainID,
    jsonRpcProvider: providers.JsonRpcProvider,
    onRequest: OnRequest,
    config: RifRelayConfig,
    cache?: (privateKey: string, mnemonic?: string) => void,
  ) {
    const wallet = super.create(
      mnemonic,
      chainId,
      jsonRpcProvider,
      onRequest,
      cache,
    )

    // bypass the EOAWallet's _signTypedData since the consent is already given
    wallet._signTypedData = Wallet.prototype._signTypedData

    const rifRelaySdk = await RIFRelaySDK.create(wallet, config)

    return new RelayWallet(
      wallet.privateKey,
      chainId,
      jsonRpcProvider,
      rifRelaySdk,
      onRequest,
    )
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

  override async estimateGas(
    txRequest: TransactionRequest,
    tokenContract?: string,
  ) {
    if (tokenContract) {
      return this.rifRelaySdk.estimateTransactionCost(txRequest, tokenContract)
    }

    return super.estimateGas(txRequest)
  }

  public static override async fromWalletState(
    keys: WalletState,
    chainId: ChainID,
    jsonRpcProvider: providers.StaticJsonRpcProvider,
    onRequest: OnRequest,
    config: RifRelayConfig,
  ) {
    const wallet = EOAWallet.fromWalletState(
      keys,
      chainId,
      jsonRpcProvider,
      onRequest,
    )

    // bypass the EOAWallet's _signTypedData since the consent is already given
    wallet._signTypedData = Wallet.prototype._signTypedData

    const sdk = await RIFRelaySDK.create(wallet, config)
    return new RelayWallet(
      wallet.privateKey,
      chainId,
      jsonRpcProvider,
      sdk,
      onRequest,
    )
  }
}
