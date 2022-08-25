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

const rifToken = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'

const setupSDK = async (rifWallet: RIFWallet): Promise<SDK> => {
  const chainId = 31 // (await provider.getNetwork()).chainId

  const sdkFullConfig: SDKConfiguration = {
    ...sdkConfig,
    chainId,
    signer: rifWallet, //.smartWallet.signer, // with the RIF wallet, signature is not correct :-(
  }

  // @ts-ignore provider is not undefiend from the rifWallet
  return SDK.create(rifWallet.provider, sdkFullConfig)
}

const createDeployRequest = async (sdk: SDK, rifWallet: RIFWallet) => {
  const relayUtils = sdk.instance.modules.relayUtils
  const signerAddress = await rifWallet.smartWallet.signer.getAddress()

  return relayUtils.createDeployRequest(
    signerAddress.toLowerCase(),
    rifToken,
    '0', // 10,
    '0x00', // 30000,
  )
}

const createRelayRequest = async (
  sdk: SDK,
  rifWallet: RIFWallet,
  transaction: any,
) => {
  /**
   * @param from - sender's wallet address (EOA)
   * @param to - recipient contract
   * @param forwarder - smart wallet address forwarding the relay request
   * @param data - payload for the execution (e.g. encoded call when invoking an smart contract) - Hex prefixed string
   * tokenContract
   * @param gasLimit - gas limit of the relayed transaction
   * @param tokenContract - the token the user will use to pay to the Worker for relaying
   * @param tokenAmount - the token amount the user will pay for relaying, zero if the call is subsidized
   * tokenGas - gas limit of the token payment
   */

  const relayRequest = await sdk.instance.modules.relayUtils.createRelayRequest(
    rifWallet.smartWallet.address, // from,
    transaction.to, // to, the RIF token
    rifWallet.smartWalletAddress, // forwarder
    transaction.data, // data,
    rifToken, // tokenContract,
    '0', // tokenAmount,
    '65164000', // tokenGas
  )

  const relayRequestManual = {
    request: {
      relayHub: '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387',
      from: '0xa735b445583D00aaB60abcb1AfE67FD6ffA5039C',
      to: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
      data: '0xa9059cbb0000000000000000000000003dd03d7d6c3137f1eb7582ba5957b8a2e26f304a0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      value: '0',
      gas: '0x41f9',
      nonce: '1',
      tokenContract: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
      tokenAmount: '0',
      tokenGas: '65164000',
    },
    relayData: {
      gasPrice: '65164000',
      relayWorker: '0x74105590d404df3f384a099c2e55135281ca6b40',
      callForwarder: '0x06c439A2C332C639e9B1AEA4a7F371aEAdB999Dd',
      callVerifier: '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9',
      domainSeparator:
        '0x44649f761bbaf55f4a957109dbc787a68ed6833e18b1bc7b120d52440ec06afc',,
    },
  }

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
  // const metadata = await createMetaData(rifWallet, signature)

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

export const relayTransaction = async (rifWallet: RIFWallet) => {
  const sdk = await setupSDK(rifWallet)
  console.log('checkpoint 1', { sdk })

  const transaction = {
    to: rifToken,
    // send 1 tRIF to jesse:
    data: '0xa9059cbb0000000000000000000000003dd03d7d6c3137f1eb7582ba5957b8a2e26f304a0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    from: rifWallet.address,
  }

  console.log('checkpoint 2', { transaction })

  const relayRequest = await createRelayRequest(sdk, rifWallet, transaction)
  console.log('checkpoint 3', { relayRequest })

  /*
  const signature = await sdk.instance.modules.relayUtils.signRelayRequest(
    relayRequest,
  )
  console.log('checkpoint 4', { signature })
  */

  const domain = getDomainSeparator(rifWallet.smartWalletAddress, 31)
  const types = dataTypeFields(false)

  const value = {
    ...relayRequest.request,
    relayData: relayRequest.relayData,
  }
  const signature = await rifWallet._signTypedData(domain, types, value)

  console.log('checkpoint 4', { signature })
  // console.log('equal?', signature === signature2)

  // const rifWalletSigner = await rifWallet.getAddress()

  postRequestToRelay(rifWallet, relayRequest, signature)
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

  /*
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
  */
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
