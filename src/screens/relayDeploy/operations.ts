import SDK from '@jessgusclark/rsk-multi-token-sdk'
import { RIFWallet } from '../../lib/core'

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
    smartWalletContractAddress: rifWallet.smartWalletAddress,
    smartWalletFactoryContractAddress:
      '0x793aeD698783c5F24BC0c0cB73968DFfFB237F83'.toLowerCase(),
    signer: rifWallet,
  }

  // @ts-ignore provider is not undefiend from the rifWallet
  return SDK.create(rifWallet.provider, sdkConfig)
}

export const deploySmartWallet = async (rifWallet: RIFWallet) => {
  const sdk = await setupSDK(rifWallet)

  const relayUtils = sdk.instance.modules.relayUtils
  const signerAddress = await rifWallet.smartWallet.signer.getAddress()

  const rifToken = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'.toLowerCase()

  const deployRequest = await relayUtils.createDeployRequest(
    signerAddress.toLowerCase(),
    rifToken,
    '10',
    '30000',
  )

  console.log({ deployRequest })

  const signedRequest = await relayUtils.signDeployRequest(deployRequest)

  console.log({ signedRequest })
}
