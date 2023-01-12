import { TypedDataSigner } from '@ethersproject/abstract-signer'
import {
  TransactionResponse,
  TransactionRequest,
} from '@ethersproject/abstract-provider'
import axios, { AxiosResponse } from 'axios'
import { BigNumber, ethers } from 'ethers'

import { SmartWallet } from '../core/SmartWallet'
import {
  RelayPayment,
  RelayRequest,
  DeployRequest,
  RifRelayConfig,
  ServerConfig,
  ServerEstimate,
  Address,
} from './types'
import {
  dataTypeFields,
  getDomainSeparator,
  INTERNAL_TRANSACTION_ESTIMATE_CORRECTION,
  MAX_RELAY_NONCE_GAP,
  validUntilTime,
  ZERO_ADDRESS,
} from './helpers'

import { SmartWalletFactory } from '../core/SmartWalletFactory'

export class RIFRelaySDK {
  chainId: number
  sdkConfig: RifRelayConfig
  serverConfig: ServerConfig | null

  smartWallet: SmartWallet
  smartWalletFactory: SmartWalletFactory
  smartWalletAddress: string
  eoaAddress: string
  provider: ethers.providers.Provider

  constructor(
    smartWallet: SmartWallet,
    smartWalletFactory: SmartWalletFactory,
    chainId: number,
    eoaAddress: string,
    sdkConfig: RifRelayConfig,
  ) {
    // this should not happen but is more for typescript:
    if (!smartWallet.signer.provider) {
      throw new Error('unexpected signer/provider is null')
    }

    this.provider = smartWallet.signer.provider
    this.smartWallet = smartWallet
    this.smartWalletFactory = smartWalletFactory
    this.chainId = chainId
    this.sdkConfig = sdkConfig

    this.smartWalletAddress = smartWallet.smartWalletAddress
    this.eoaAddress = eoaAddress

    this.serverConfig = null
  }

  static async create(
    smartWallet: SmartWallet,
    smartWalletFactory: SmartWalletFactory,
    rifRelayConfig: RifRelayConfig,
  ) {
    const eoaAddress = await smartWallet.signer.getAddress()
    const chainId = await smartWallet.signer.getChainId()

    return new RIFRelaySDK(
      smartWallet,
      smartWalletFactory,
      chainId,
      eoaAddress,
      rifRelayConfig,
    )
  }

  private getServerConfig = (): Promise<ServerConfig> =>
    axios
      .get(`${this.sdkConfig.relayServer}/getaddr`)
      .then(
        (response: AxiosResponse<ServerConfig>) =>
          (this.serverConfig = response.data),
      )

  private createRelayRequest = async (
    tx: TransactionRequest,
    payment: RelayPayment,
  ): Promise<RelayRequest> => {
    const gasPrice = tx.gasPrice || (await this.provider.getGasPrice())
    const nonce = await this.smartWallet.nonce()
    const tokenGas = await this.estimateTokenTransferCost(
      payment.tokenContract,
      payment.tokenAmount,
    )

    const estimated = await this.provider.estimateGas({ ...tx, gasPrice })
    const correction =
      estimated.toNumber() > INTERNAL_TRANSACTION_ESTIMATE_CORRECTION
        ? estimated.sub(INTERNAL_TRANSACTION_ESTIMATE_CORRECTION)
        : estimated
    const internalCallCost = Math.round(correction.toNumber() * 1.01)

    const relayRequest: RelayRequest = {
      request: {
        relayHub: this.serverConfig!.relayHubAddress,
        from: this.eoaAddress,
        to: tx.to || ZERO_ADDRESS,
        data: tx.data?.toString() || '0x',
        value: tx.value?.toString() || '0',
        gas: internalCallCost.toString(),
        nonce: nonce.toString(),
        tokenContract: payment.tokenContract,
        tokenAmount: payment.tokenAmount.toString(),
        tokenGas,
        validUntilTime: validUntilTime().toString(),
      },
      relayData: {
        gasPrice: gasPrice.toString(),
        feesReceiver: this.serverConfig!.feesReceiver,
        callForwarder: this.smartWalletAddress,
        callVerifier: this.sdkConfig.relayVerifierAddress,
      },
    }

    return relayRequest
  }

  private signRelayRequest = async (
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
    tx: TransactionRequest,
    payment: RelayPayment,
  ): Promise<TransactionResponse> => {
    if (Object.is(this.serverConfig, null)) {
      await this.getServerConfig()
    }

    const request = await this.createRelayRequest(tx, payment)
    const signature = await this.signRelayRequest(request, false)

    return this.sendRequestToRelay(request, signature).then((hash: string) =>
      this.provider.getTransaction(hash),
    )
  }

  // The following methods are for deploying a smart wallet
  private createDeployRequest = async (
    payment: RelayPayment,
  ): Promise<DeployRequest> => {
    const gasPrice = await this.provider.getGasPrice()
    const nonce = await this.smartWalletFactory.getNonce(this.eoaAddress)
    const tokenGas = await this.estimateTokenTransferCost(
      payment.tokenContract,
      payment.tokenAmount,
    )

    const deployRequest: DeployRequest = {
      request: {
        relayHub: this.serverConfig!.relayHubAddress,
        from: this.eoaAddress,
        to: ZERO_ADDRESS,
        value: '0',
        nonce: nonce.toString(),
        data: '0x',
        tokenContract: payment.tokenContract,
        tokenAmount: payment.tokenAmount.toString(),
        tokenGas,
        recoverer: ZERO_ADDRESS,
        index: '0',
        validUntilTime: validUntilTime().toString(),
      },
      relayData: {
        gasPrice: gasPrice.toString(),
        feesReceiver: this.serverConfig!.feesReceiver,
        callForwarder: this.smartWalletFactory.address,
        callVerifier: this.sdkConfig.deployVerifierAddress,
      },
    }

    return deployRequest
  }

  async sendDeployTransaction(
    payment: RelayPayment,
  ): Promise<TransactionResponse> {
    if (Object.is(this.serverConfig, null)) {
      await this.getServerConfig()
    }

    const deployRequest = await this.createDeployRequest(payment)

    const signature = await this.signRelayRequest(deployRequest, true)

    return this.sendRequestToRelay(deployRequest, signature).then(
      (hash: string) => this.provider.getTransaction(hash),
    )
  }

  private prepareDataForServer = (
    request: RelayRequest | DeployRequest,
    signature: string,
  ) =>
    this.provider
      .getTransactionCount(this.serverConfig!.relayWorkerAddress)
      .then((relayMaxNonce: number) => {
        const metadata = {
          relayHubAddress: this.serverConfig!.relayHubAddress,
          relayMaxNonce: relayMaxNonce + MAX_RELAY_NONCE_GAP,
          signature,
        }

        const relayRequest = {
          ...request,
          request: {
            ...request.request,
            validUntilTime: request.request.validUntilTime.toString(),
          },
        }

        return { metadata, relayRequest }
      })

  private sendRequestToRelay = (
    request: RelayRequest | DeployRequest,
    signature: string,
  ) =>
    new Promise<string>((resolve, reject) =>
      this.prepareDataForServer(request, signature).then(relayRequest =>
        axios
          .post(`${this.sdkConfig.relayServer}/relay`, relayRequest)
          .then((response: AxiosResponse) => {
            if (response.data.error) {
              return reject(response.data.error)
            }

            // if okay...
            return resolve(response.data.transactionHash)
          })
          .catch(reject),
      ),
    )

  estimateTransactionCost = async (
    tx: TransactionRequest,
    tokenContract: Address,
  ): Promise<BigNumber> => {
    if (Object.is(this.serverConfig, null)) {
      await this.getServerConfig()
    }

    const payment = {
      tokenContract,
      tokenAmount: BigNumber.from(0),
    }
    const relayRequest = await this.createRelayRequest(tx, payment)
    const signature = await this.signRelayRequest(relayRequest, false)
    const request = await this.prepareDataForServer(relayRequest, signature)

    return await axios
      .post(`${this.sdkConfig.relayServer}/estimate`, request)
      .then((response: AxiosResponse<ServerEstimate>) =>
        BigNumber.from(response.data.requiredTokenAmount),
      )
  }

  // the cost to send the token payment from the smartwallet to the fee collector:
  private estimateTokenTransferCost = async (
    tokenAddress: string,
    feeAmount: BigNumber,
  ) => {
    const feesReceiver = this.serverConfig!.feesReceiver.replace('0x', '')
    const feeHex = feeAmount.toHexString().replace('0x', '')
    const amount = String(feeHex).padStart(64 - feeHex.length, '0')

    return this.smartWallet.signer
      .estimateGas({
        to: tokenAddress.toLowerCase(),
        data: `0xa9059cbb000000000000000000000000${feesReceiver}${amount}`,
      })
      .then((estGas: BigNumber) => estGas.toString())
  }
}
