import { TypedDataSigner } from '@ethersproject/abstract-signer'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import axios, { AxiosResponse } from 'axios'
import { ethers, Transaction } from 'ethers'

import { SmartWallet } from '../core/SmartWallet'
import {
  RelayPayment,
  RelayRequest,
  SdkConfig,
  DeployRequest,
  RifRelayConfig,
} from './types'
import {
  dataTypeFields,
  getDomainSeparator,
  getDomainSeparatorHash,
  INTERNAL_TRANSACTION_ESTIMATE_CORRECTION,
  MAX_RELAY_NONCE_GAP,
  ZERO_ADDRESS,
} from './helpers'

import { SmartWalletFactory } from '../core/SmartWalletFactory'

export class RIFRelaySDK {
  chainId: number
  sdkConfig: any
  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory
  smartWalletAddress: string
  eoaAddress: string
  provider: ethers.providers.JsonRpcProvider

  constructor(
    smartWallet: SmartWallet,
    smartWalletFactory: SmartWalletFactory,
    chainId: number,
    eoaAddress: string,
    sdkConfig: SdkConfig,
  ) {
    // @ts-ignore: smartWallet.signer.provider is defined from RIF Wallet
    this.provider = smartWallet.signer.provider
    this.smartWallet = smartWallet
    this.smartWalletFactory = smartWalletFactory
    this.chainId = chainId
    this.sdkConfig = sdkConfig

    this.smartWalletAddress = smartWallet.smartWalletAddress
    this.eoaAddress = eoaAddress
  }

  static async create(
    smartWallet: SmartWallet,
    smartWalletFactory: SmartWalletFactory,
    rifRelayConfig: RifRelayConfig,
  ) {
    const eoaAddress = await smartWallet.signer.getAddress()
    const chainId = await smartWallet.signer.getChainId()

    const { relayWorkerAddress, relayHubAddress } =
      await this.getAddrFromServer(rifRelayConfig.relayServer)

    return new RIFRelaySDK(
      smartWallet,
      smartWalletFactory,
      chainId,
      eoaAddress,
      {
        ...rifRelayConfig,
        relayWorkerAddress,
        relayHubAddress,
      },
    )
  }

  static getAddrFromServer = (server: string) =>
    axios.get(`${server}/getaddr`).then((value: AxiosResponse) => value.data)

  createRelayRequest = async (
    tx: Transaction,
    payment: RelayPayment,
  ): Promise<RelayRequest> => {
    const gasToSend = tx.gasPrice || (await this.provider.getGasPrice())
    const nonce = await (await this.smartWallet.nonce()).toString()

    const estimated = await this.provider.estimateGas({
      from: tx.from,
      to: tx.to,
      gasPrice: gasToSend,
      data: tx.data,
    })
    const internalCallCost = estimated.gt(
      INTERNAL_TRANSACTION_ESTIMATE_CORRECTION,
    )
      ? estimated.sub(INTERNAL_TRANSACTION_ESTIMATE_CORRECTION)
      : estimated

    const relayRequest: RelayRequest = {
      request: {
        relayHub: this.sdkConfig.relayHubAddress,
        from: this.eoaAddress,
        to: tx.to || ZERO_ADDRESS,
        data: tx.data,
        value: tx.value ? tx.value.toString() : '0',
        gas: internalCallCost.toHexString(),
        nonce,
        tokenContract: payment.tokenContract,
        tokenAmount: payment.tokenAmount.toString(),
        tokenGas: gasToSend.toString(),
      },
      relayData: {
        gasPrice: gasToSend.toString(),
        relayWorker: this.sdkConfig.relayWorkerAddress,
        callForwarder: this.smartWalletAddress,
        callVerifier: this.sdkConfig.relayVerifierAddress,
        domainSeparator: getDomainSeparatorHash(
          this.smartWalletAddress,
          this.chainId,
        ),
      },
    }

    return relayRequest
  }

  signRelayRequest = async (
    relayRequest: RelayRequest | DeployRequest,
    isDeployRequest: boolean,
  ): Promise<string> => {
    const domain = getDomainSeparator(
      isDeployRequest
        ? this.smartWalletFactory.address
        : this.smartWalletAddress,
      this.chainId,
    )

    const types = dataTypeFields(isDeployRequest)

    const value = {
      ...relayRequest.request,
      relayData: relayRequest.relayData,
    }

    const signature = await (
      this.smartWallet.signer as any as TypedDataSigner
    )._signTypedData(domain, types, value)

    return signature
  }

  sendRelayTransaction = async (
    tx: any,
    payment: RelayPayment,
  ): Promise<TransactionResponse> => {
    const request = await this.createRelayRequest(tx, payment)
    const signature = await this.signRelayRequest(request, false)

    const txHash = await this.sendRequestToRelay(request, signature)

    return await this.provider.getTransaction(txHash)
  }

  // The following methods are for deploying a smart wallet
  createDeployRequest = async (
    payment: RelayPayment,
  ): Promise<DeployRequest> => {
    const gasToSend = await this.provider.getGasPrice()
    const nonce = await this.smartWalletFactory.getNonce(this.eoaAddress)

    const deployRequest: DeployRequest = {
      request: {
        relayHub: this.sdkConfig.relayHubAddress,
        from: this.eoaAddress,
        to: ZERO_ADDRESS,
        value: '0',
        nonce,
        data: '0x',
        tokenContract: payment.tokenContract,
        tokenAmount: payment.tokenAmount.toString(),
        tokenGas: '0',
        recoverer: ZERO_ADDRESS,
        index: '0',
      },
      relayData: {
        gasPrice: gasToSend.toString(),
        relayWorker: this.sdkConfig.relayWorkerAddress,
        callForwarder: this.smartWalletFactory.address,
        callVerifier: this.sdkConfig.deployVerifierAddress,
        domainSeparator: getDomainSeparatorHash(
          this.smartWalletFactory.address,
          this.chainId,
        ),
      },
    }

    return deployRequest
  }

  async sendDeployTransaction(payment: RelayPayment) {
    const deployRequest = await this.createDeployRequest(payment)

    const signature = await this.signRelayRequest(deployRequest, true)

    const txHash = await this.sendRequestToRelay(deployRequest, signature)

    return await this.provider.getTransaction(txHash)
  }

  sendRequestToRelay = (
    request: RelayRequest | DeployRequest,
    signature: string,
  ) =>
    new Promise<string>((resolve, reject) =>
      this.provider
        .getTransactionCount(this.sdkConfig.relayWorkerAddress)
        .then((relayMaxNonce: number) => {
          const metadata = {
            relayHubAddress: this.sdkConfig.relayHubAddress,
            relayMaxNonce: relayMaxNonce + MAX_RELAY_NONCE_GAP,
            signature,
          }

          return axios
            .post(`${this.sdkConfig.relayServer}/relay`, {
              relayRequest: request,
              metadata,
            })
            .then((response: AxiosResponse) => {
              if (response.data.error) {
                console.log(response)
                return reject(response.data.error)
              }

              // if okay...
              console.log('SUCCESS: returning FAKE txHash for now...')
              resolve(
                response.data.txHash ||
                  '0xbd6bee7d78d64492083974f1c83328088317795a204bbfc3890aa1bd4cbe67cf',
              )
            })
            .catch(reject)
        }),
    )
}
