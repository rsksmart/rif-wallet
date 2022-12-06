import Config from 'react-native-config'
import { ethers } from 'ethers'
import { RGSmartWalletFactory } from './RGSmartWalletFactory'
import { ForwardRequestStruct } from './types'

class RGSigner {
  static async executeTransaction(
    signer: ethers.Signer,
    provider: ethers.providers.Web3Provider,
    executor: string,
    chainId: string,
    signFn: (domain: any, types: any, value: any) => Promise<any>,
    fn: Function,
    args: Array<any>,
  ): Promise<any> {
    const swFactoryAddr = Config.GATEWAY_SW_FACTORY || ''
    const from = await signer.getAddress()
    const swFactory = new RGSmartWalletFactory(swFactoryAddr, provider)
    const { smartWalletAddress, nonce } = await swFactory.getSmartWalletNonce(
      from,
    )

    const msgParams = {
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        ForwardRequest: [
          { name: 'from', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'executor', type: 'address' },
        ],
      },
      domain: {
        // Give a user friendly name to the specific contract you are signing for.
        name: 'RSK RIF GATEWAY',
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1',
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: chainId,
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: smartWalletAddress,
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'ForwardRequest',
      // Defining the message signing data content.
      message: {
        from: from,
        nonce: nonce.toString(),
        executor: executor,
      },
    }

    const signature = await signFn(
      msgParams.domain,
      msgParams.types,
      msgParams.message,
    )

    const forwardRequest: ForwardRequestStruct = {
      from: from,
      nonce: nonce!.toString(),
      executor: executor,
    }

    const suffixData = ethers.constants.HashZero

    console.log('Signed transaction, signature: ', signature)

    return fn(suffixData, forwardRequest, signature, ...args)
  }
}

export { RGSigner }
