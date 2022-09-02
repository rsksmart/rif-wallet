import { ethers } from 'ethers'
import { TypedDataSigner } from '@ethersproject/abstract-signer'
import { SmartWallet } from '../core/SmartWallet'
import { RelayRequest } from './types'
import {
  dataTypeFields,
  getDomainSeparator,
  getDomainSeparatorHash,
  MAX_RELAY_NONCE_GAP,
} from './helpers'
import axios, { AxiosResponse } from 'axios'

export class RIFRelaySDK {
  chainId: number
  sdkConfig: any
  smartWallet: SmartWallet
  smartWalletAddress: string
  eoaAddress: string
  provider: any

  constructor(
    smartWallet: SmartWallet,
    chainId: number,
    eoaAddress: string,
    sdkConfig: any,
  ) {
    this.provider = smartWallet.signer.provider
    this.smartWallet = smartWallet
    this.chainId = chainId
    this.sdkConfig = sdkConfig

    this.smartWalletAddress = smartWallet.address
    this.eoaAddress = eoaAddress
  }

  static async create(smartWallet: SmartWallet, chainId: number) {
    const sdkConfig = {
      relayWorkerAddress: '0x74105590d404df3f384a099c2e55135281ca6b40',
      relayVerifierAddress: '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9',
      deployVerifierAddress: '0x5C6e96a84271AC19974C3e99d6c4bE4318BfE483',
      smartWalletContractAddress: '0xEdB6D515C2DB4F9C3C87D7f6Cefb260B3DEe8014',
      smartWalletFactoryContractAddress:
        '0xeaB5b9fA91aeFFaA9c33F9b33d12AB7088fa7f6f',
      relayHubAddress: '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387',
      relayServer: 'https://dev.relay.rifcomputing.net:8090',
    }
    console.log('does the signer have a provider?', smartWallet.signer.provider)

    const eoaAddress = await smartWallet.signer.getAddress()

    return new RIFRelaySDK(smartWallet, chainId, eoaAddress, sdkConfig)
  }

  async createRelayRequest(tx: any, payment: any): Promise<RelayRequest> {
    const gasToSend = '65164000' // await this.provider.getGasPrice() //in WEI @JESSE!
    const nonce = await (await this.smartWallet.nonce()).toString()

    const relayRequest: RelayRequest = {
      request: {
        relayHub: this.sdkConfig.relayHubAddress,
        from: this.eoaAddress,
        to: tx.to,
        data: tx.data,
        value: tx.value ? tx.value.toString() : '0',
        gas: gasToSend,
        nonce,
        tokenContract: payment.tokenContract,
        tokenAmount: payment.tokenAmount.toString(),
        tokenGas: gasToSend,
      },
      relayData: {
        gasPrice: gasToSend,
        relayWorker: this.sdkConfig.relayWorkerAddress,
        callForwarder: this.eoaAddress,
        callVerifier: this.sdkConfig.relayVerifierAddress,
        domainSeparator: getDomainSeparatorHash(this.eoaAddress, this.chainId),
      },
    }

    return relayRequest // { domain, types, value:  }
  }

  signRelayRequest = (relayRequest: RelayRequest) => {
    const domain = getDomainSeparator(this.smartWalletAddress, this.chainId)
    const types = dataTypeFields(false)

    const value = {
      ...relayRequest.request,
      relayData: relayRequest.relayData,
    }
    return (this.smartWallet.signer as any as TypedDataSigner)._signTypedData(
      domain,
      types,
      value,
    )
  }

  sendRelayRequest = async (tx: any, payment: any) => {
    console.log('THIS DOES IT ALL!', tx, payment)
    const request = await this.createRelayRequest(tx, payment)
    const signature = await this.signRelayRequest(request)
    const txHash = await this.sendRequestToRelay(request, signature)
    console.log({ request, signature, txHash })

    return 'hehe hoho haha'
  }

  // createDeployRequest

  // esitmate transaction cost

  sendRequestToRelay = (request: any, signature: string) => {
    console.log('sending to the server...', request)
    return this.provider
      .getTransactionCount(this.sdkConfig.relayWorkerAddress)
      .then((relayMaxNonce: number) => {
        const metadata = {
          relayHubAddress: this.sdkConfig.relayHubAddress,
          relayMaxNonce: relayMaxNonce + MAX_RELAY_NONCE_GAP,
          signature,
        }

        console.log('checkpoint 5', {
          relayRequest: request,
          metadata,
        })

        return axios
          .post(`${this.sdkConfig.relayServer}/relay`, {
            relayRequest: request,
            metadata,
          })
          .then((response: AxiosResponse) => {
            console.log('SERVER', response)
            if (response.data.error) {
              return console.log('ERROR!', response.data.error)
            }

            // if okay...
            console.log('SUCCESS: returning FAKE txHash for now...')
            return '0xbd6bee7d78d64492083974f1c83328088317795a204bbfc3890aa1bd4cbe67cf'
          })
          .catch(console.log)
      })
  }
}
