import SDK from '@jessgusclark/rsk-multi-token-sdk'

import { RIFWallet } from '../../lib/core'
import { dataTypeFields, getDomainSeparator } from './types'
import expected from './expected.json'

const setupSDK = async (rifWallet: RIFWallet): Promise<SDK> => {
  const chainId = 31 // (await provider.getNetwork()).chainId

  const sdkConfig = {
    chainId,
    relayWorkerAddress:
      '0x74105590d404df3f384a099c2e55135281ca6b40'.toLowerCase(),
    relayVerifierAddress:
      '0x56ccdB6D312307Db7A4847c3Ea8Ce2449e9B79e9'.toLowerCase(),
    deployVerifierAddress:
      '0x5C6e96a84271AC19974C3e99d6c4bE4318BfE483'.toLowerCase(),
    smartWalletContractAddress:
      '0xEdB6D515C2DB4F9C3C87D7f6Cefb260B3DEe8014'.toLowerCase(),
    smartWalletFactoryContractAddress:
      '0xeaB5b9fA91aeFFaA9c33F9b33d12AB7088fa7f6f'.toLowerCase(),
    signer: rifWallet.smartWallet.signer,
    relayHubContractAddress:
      '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387'.toLowerCase(),
  }

  // @ts-ignore provider is not undefiend from the rifWallet
  return SDK.create(rifWallet.provider, sdkConfig)
}

export const deploySmartWallet = async (rifWallet: RIFWallet) => {
  const sdk = await setupSDK(rifWallet)

  sdk.instance._ethers

  console.log('checkpoint 1', { sdk })

  const relayUtils = sdk.instance.modules.relayUtils
  const signerAddress =
    '0xa735b445583D00aaB60abcb1AfE67FD6ffA5039C'.toLowerCase() // await rifWallet.smartWallet.signer.getAddress()

  const rifToken = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'.toLowerCase()

  const deployRequest = await relayUtils.createDeployRequest(
    signerAddress.toLowerCase(),
    rifToken,
    10,
    30000,
  )

  console.log('checkpoint 2', { deployRequest })

  /*
  const request = new TypedDeployRequestData(
    31,
    '0xeaB5b9fA91aeFFaA9c33F9b33d12AB7088fa7f6f'.toLowerCase(),
    deployRequest,
  )
  */

  // console.log('checkpoint 3', )

  // const signRequest = _signTypedData(dataToSign.domain,dataTypeFields, dataToSign.message)
  // const signedRequest = await relayUtils.signDeployRequest(deployRequest)

  const domain = getDomainSeparator(deployRequest.relayData.callVerifier, 31)
  const types = dataTypeFields(true)
  const values = {
    ...deployRequest.request,
    relayData: deployRequest.relayData,
  }

  console.log('actual:', { domain, types, values })

  console.log('checking domain', domain === expected.domain)
  console.log('checking types ', types === expected.types)
  console.log('checking values', values === expected.message)

  const signedRequest = await rifWallet._signTypedData(domain, types, values)

  /*
  const signedRequest = await rifWallet.smartWallet.signer._signTypedData(
    expected.domain,
    expected.types,
    expected.message,
  )
  */

  console.log('checkpoint 4', { signedRequest })
}
