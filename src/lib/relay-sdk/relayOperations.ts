// This is a work in progress and will get refactored:

import SDK from '@jessgusclark/rsk-multi-token-sdk'
import axios, { AxiosResponse } from 'axios'
import { TransactionRequest } from '@ethersproject/abstract-provider'

import { RIFWallet } from '../../lib/core'
import { dataTypeFields, getDomainSeparator } from './helpers'
import { SDKConfiguration } from './types'
import { Deferrable } from 'ethers/lib/utils'

export const MAX_RELAY_NONCE_GAP = 3

const sdkConfig: SDKConfiguration = {
  relayWorkerAddress: '0x74105590d404df3f384a099c2e55135281ca6b40',
  relayVerifierAddress: '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9',
  deployVerifierAddress: '0x5C6e96a84271AC19974C3e99d6c4bE4318BfE483',
  smartWalletContractAddress: '0xEdB6D515C2DB4F9C3C87D7f6Cefb260B3DEe8014',
  smartWalletFactoryContractAddress:
    '0xeaB5b9fA91aeFFaA9c33F9b33d12AB7088fa7f6f',
  relayHubContractAddress: '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387',
}

const rifToken = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'

export const setupSDK = async (rifWallet: RIFWallet): Promise<SDK> => {
  const chainId = 31 // (await provider.getNetwork()).chainId

  const sdkFullConfig: SDKConfiguration = {
    ...sdkConfig,
    chainId,
    signer: rifWallet,
  }

  // @ts-ignore provider is not undefiend from the rifWallet
  return SDK.create(rifWallet.provider, sdkFullConfig)
}

export const createDeployRequest = async (sdk: SDK, rifWallet: RIFWallet) => {
  const relayUtils = sdk.instance.modules.relayUtils
  const signerAddress = await rifWallet.smartWallet.signer.getAddress()

  return relayUtils.createDeployRequest(
    signerAddress.toLowerCase(),
    rifToken,
    '0', // 10,
    '0x00', // 30000,
  )
}

export const createRelayRequest = async (
  sdk: SDK,
  rifWallet: RIFWallet,
  transaction: TransactionRequest,
) => {
  const relayRequest = await sdk.instance.modules.relayUtils.createRelayRequest(
    rifWallet.smartWallet.address, // from,
    transaction.to || '0x0000000000000000000000000000000000000000', // to, the RIF token
    rifWallet.smartWalletAddress, // forwarder
    transaction.data, // data,
    rifToken, // tokenContract,
    '0', // tokenAmount,
    '65164000', // tokenGas
  )

  return relayRequest
}

const postRequestToRelay = async (
  rifWallet: RIFWallet,
  request: any,
  signature: string,
) => {
  // @ts-ignore - provider is defined
  const relayMaxNonce = await rifWallet.provider.getTransactionCount(
    sdkConfig.relayWorkerAddress,
  )

  const metadata = {
    relayHubAddress: sdkConfig.relayHubContractAddress,
    relayMaxNonce: relayMaxNonce + MAX_RELAY_NONCE_GAP,
    signature,
  }

  console.log('checkpoint 5', {
    relayRequest: request,
    metadata,
  })

  axios
    .post('https://dev.relay.rifcomputing.net:8090/relay', {
      relayRequest: request,
      metadata,
    })
    .then((response: AxiosResponse) => console.log('SERVER', response))
    .catch(console.log)
}

/**
 * BELOW IS THE ENTIRE PROCESS:
 */


export const relayTransaction = async (
  rifWallet: RIFWallet,
  transaction: Deferrable<TransactionRequest>,
) => {
  const sdk = await setupSDK(rifWallet)
  console.log('🦄 checkpoint 1', { sdk })

  console.log('checkpoint 2', { transaction })

  const relayRequest = await createRelayRequest(sdk, rifWallet, transaction)
  console.log('checkpoint 3', { relayRequest })

  const domain = getDomainSeparator(rifWallet.smartWalletAddress, 31)
  const types = dataTypeFields(false)

  const value = {
    ...relayRequest.request,
    relayData: relayRequest.relayData,
  }

  console.log({ domain, types, value })

  const signature = await rifWallet._signTypedData(domain, types, value)
  const signature2 = await rifWallet.smartWallet.signer._signTypedData(domain, types, value)

  console.log('checkpoint 4', signature, signature2)

  console.log('JESSE, END, NOT POSTING TO SERVER')
  // postRequestToRelay(rifWallet, relayRequest, signature)
}

export const deploySmartWallet = async (rifWallet: RIFWallet) => {
  const sdk = await setupSDK(rifWallet)

  console.log('checkpoint 1', { sdk })
  const deployRequest = await createDeployRequest(sdk, rifWallet)

  console.log('checkpoint 2', { deployRequest })

  // const signatureLocal = await rifWallet._signTypedData(domain, types, values)
  const signature = await sdk.instance.modules.relayUtils.signDeployRequest(
    deployRequest,
  )

  console.log({ signature })

  console.log('JESSE END, NOT POSTING TO SERVER!')
  // postRequestToRelay(rifWallet, deployRequest, signature)
}
