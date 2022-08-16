import SDK from '@jessgusclark/rsk-multi-token-sdk'
import axios, { AxiosResponse } from 'axios'

import { RIFWallet } from '../../lib/core'
import { dataTypeFields, getDomainSeparator } from './helpers'
import { SDKConfiguration } from './types'

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

const setupSDK = async (rifWallet: RIFWallet): Promise<SDK> => {
  const chainId = 31 // (await provider.getNetwork()).chainId

  const sdkFullConfig: SDKConfiguration = {
    ...sdkConfig,
    chainId,
    signer: rifWallet, // .smartWallet.signer,
  }

  // @ts-ignore provider is not undefiend from the rifWallet
  return SDK.create(rifWallet.provider, sdkFullConfig)
}

const createDeployRequest = async (sdk: SDK, rifWallet: RIFWallet) => {
  const relayUtils = sdk.instance.modules.relayUtils
  const signerAddress = await rifWallet.smartWallet.signer.getAddress()

  const rifToken = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'
  const testToken = '0xF5859303f76596dD558B438b18d0Ce0e1660F3ea'

  /*
  const deployRequest: DeployRequest = {
    request: {
      relayHub: this.relayHubAddress,
      from: from,
      to: ZERO_ADDRESS,
      value: '0',
      nonce: nonce,
      data: '0x',
      tokenContract: tokenContract,
      tokenAmount: tokenAmount.toString(),
      tokenGas: tokenGas.toString(),
      recoverer: recoverer ?? ZERO_ADDRESS,
      index: index?.toString() ?? '0'
    },
    relayData: {
      gasPrice: gasPrice?.toString() ??  (await this.provider.getGasPrice()).toString(), //in WEI
      relayWorker: this.relayWorkerAddress,
      callForwarder: this.factory.address,
      callVerifier: this.deployVerifierContract.address,
      domainSeparator: getDomainSeparatorHash(this.factory.address, this.chainId)
    }
  }
  */

  return relayUtils.createDeployRequest(
    signerAddress.toLowerCase(),
    rifToken,
    '1', // 10,
    '0x00', // 30000,
  )
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
    .then((response: AxiosResponse) => console.log('SERVER', response.data))
    .catch(console.log)
}

export const deploySmartWallet = async (rifWallet: RIFWallet) => {
  const sdk = await setupSDK(rifWallet)

  console.log('checkpoint 1', { sdk })
  const deployRequest = await createDeployRequest(sdk, rifWallet)

  console.log('checkpoint 2', { deployRequest })

  // domainSeparator: 0xa81483953da7601ef828906dbab2e4baf21ddfd3d3c484fe7c43c55836c6c772
  const domain = getDomainSeparator(deployRequest.relayData.callVerifier, 31)
  const types = dataTypeFields(true)
  const values = {
    ...deployRequest.request,
    relayData: deployRequest.relayData,
  }

  // const signatureLocal = await rifWallet._signTypedData(domain, types, values)
  const signature = await sdk.instance.modules.relayUtils.signDeployRequest(
    deployRequest,
  )

  // @ts-ignore
  const signature2 = await rifWallet.smartWallet.signer._signTypedData(
    domain,
    types,
    values,
  )

  console.log('checkpoint 4', {
    signature,
    signature2,
    equal: signature === signature2,
  })

  // let's check the signature:
  /*
  const typedMessage = {
    types,
    primaryType: '',
    domain: {},
    message: values,
  }

  // const sig = "0x66e61296eab80618e99820c9f7367d2ee6137e0d45b4972c0a1705cca84999411f5f443be32f62ce9d35e5a9eb3d75d3eba43cfd8992155d54ab7208e9fed4091b"

  const rec = recoverTypedSignature({
    data: typedMessage,
    // @ts-ignore
    signature,
    version: 'V4',
  })

  console.log('checkpoint:', { rec })
  const rec = recoverTypedSignature({
    // @ts-ignore
    data: { domain, types, message: values },
    sig: signature,
    version: 1,
  })

  console.log({ rec })
  */

  postRequestToRelay(rifWallet, deployRequest, signature)
  /*
  const signedRequest = await sdk.instance.modules.relayUtils.signDeployRequest(
    deployRequest,
  )

  console.log('checkpoint 3', signedRequest)

  const request = new TypedDeployRequestData(
    31,
    '0xeaB5b9fA91aeFFaA9c33F9b33d12AB7088fa7f6f'.toLowerCase(),
    deployRequest,
  )
  */

  // console.log('checkpoint 3', )

  // const signRequest = _signTypedData(dataToSign.domain,dataTypeFields, dataToSign.message)
  // const signedRequest = await relayUtils.signDeployRequest(deployRequest)
  /*


  console.log('actual:', { domain, types, values })

  console.log('checking domain', domain === expected.domain)
  console.log('checking types ', types === expected.types)
  console.log('checking values', values === expected.message)



  /*
  const signedRequest = await rifWallet.smartWallet.signer._signTypedData(
    expected.domain,
    expected.types,
    expected.message,
  )
  */

  // console.log('checkpoint 4', { signedRequest })
}
