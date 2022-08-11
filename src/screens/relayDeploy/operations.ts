import SDK, { SDKConfiguration } from '@jessgusclark/rsk-multi-token-sdk'
import axios, { AxiosResponse } from 'axios'

import { RIFWallet } from '../../lib/core'
import { dataTypeFields, getDomainSeparator } from './types'

const setupSDK = async (rifWallet: RIFWallet): Promise<SDK> => {
  const chainId = 31 // (await provider.getNetwork()).chainId

  const sdkConfig: SDKConfiguration = {
    chainId,
    relayWorkerAddress: '0x74105590d404df3f384a099c2e55135281ca6b40',
    relayVerifierAddress:
      '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9'.toLowerCase(),
    deployVerifierAddress: '0x5C6e96a84271AC19974C3e99d6c4bE4318BfE483',
    smartWalletContractAddress:
      '0xEdB6D515C2DB4F9C3C87D7f6Cefb260B3DEe8014'.toLowerCase(),
    smartWalletFactoryContractAddress:
      '0xeaB5b9fA91aeFFaA9c33F9b33d12AB7088fa7f6f',
    signer: rifWallet.smartWallet.signer,
    relayHubContractAddress:
      '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387'.toLowerCase(),
  }

  // @ts-ignore provider is not undefiend from the rifWallet
  return SDK.create(rifWallet.provider, sdkConfig)
}

const createDeployRequest = async (sdk: SDK, rifWallet: RIFWallet) => {
  const relayUtils = sdk.instance.modules.relayUtils
  const signerAddress = await rifWallet.smartWallet.signer.getAddress()

  const rifToken = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'.toLowerCase()

  return relayUtils.createDeployRequest(
    signerAddress.toLowerCase(),
    rifToken,
    '0', // 10,
    '0x00', // 30000,
  )
}

const postRequestToRelay = (request: any, signature: string) => {
  const metadata = {
    relayHubAddress: '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387',
    relayMaxNonce: 72, // number (where to get this????)
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
    .then((response: AxiosResponse) => console.log(response.data))
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
  const signature = await rifWallet._signTypedData(domain, types, values)

  console.log('checkpoint 4', { signature })

  postRequestToRelay(deployRequest, signature)
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
