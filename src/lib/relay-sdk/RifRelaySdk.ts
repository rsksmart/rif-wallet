import { TypedDataSigner } from '@ethersproject/abstract-signer'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { SmartWallet } from '../core/SmartWallet'
import { RelayPayment, RelayRequest } from './types'
import {
  dataTypeFields,
  getDomainSeparator,
  getDomainSeparatorHash,
  MAX_RELAY_NONCE_GAP,
  ZERO_ADDRESS,
} from './helpers'
import axios, { AxiosResponse } from 'axios'
import { ethers } from 'ethers'
import { DeployRequest } from './types'
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
    sdkConfig: any,
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
    chainId: number,
  ) {
    const sdkConfig = {
      relayWorkerAddress: '0x74105590d404df3f384a099c2e55135281ca6b40',
      relayVerifierAddress: '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9',
      deployVerifierAddress: '0x5C6e96a84271AC19974C3e99d6c4bE4318BfE483',
      relayHubAddress: '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387',
      relayServer: 'https://dev.relay.rifcomputing.net:8090',
    }

    const eoaAddress = await smartWallet.signer.getAddress()

    return new RIFRelaySDK(
      smartWallet,
      smartWalletFactory,
      chainId,
      eoaAddress,
      sdkConfig,
    )
  }

  // The following 3 methods are for relaying transactions:
  createRelayRequest = async (
    tx: any,
    payment: RelayPayment,
  ): Promise<RelayRequest> => {
    const gasToSend = '65164000' // await this.provider.getGasPrice() //in WEI @JESSE!
    const nonce = await (await this.smartWallet.nonce()).toString()

    const relayRequest: RelayRequest = {
      request: {
        relayHub: this.sdkConfig.relayHubAddress,
        from: this.eoaAddress,
        to: tx.to,
        data: tx.data,
        value: tx.value ? tx.value.toString() : '0',
        gas: '0x41f9',
        nonce,
        tokenContract: payment.tokenContract,
        tokenAmount: '0', // payment.tokenAmount.toString(),
        tokenGas: gasToSend,
      },
      relayData: {
        gasPrice: gasToSend,
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
    payment: any,
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
    const gasToSend = '65164000' // await this.provider.getGasPrice() //in WEI @JESSE!
    const nonce = await this.smartWalletFactory.getNonce(this.eoaAddress)

    const deployRequest: DeployRequest = {
      request: {
        relayHub: this.sdkConfig.relayHubAddress,
        from: this.eoaAddress.toLowerCase(),
        to: ZERO_ADDRESS,
        value: '0',
        nonce: nonce,
        data: '0x',
        tokenContract: payment.tokenContract,
        tokenAmount: payment.tokenAmount.toString(),
        tokenGas: '0x00', // gasToSend, // needs hex value?
        recoverer: ZERO_ADDRESS,
        index: '0',
      },
      relayData: {
        gasPrice: gasToSend,
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

  // esitmate transaction cost
  sendRequestToRelay = (request: any, signature: string) =>
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
              console.log(response)
              if (response.data.error) {
                reject(response.data.error)
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
