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
    fn: Function,
    args: Array<any>,
  ): Promise<void> {
    const swFactoryAddr = Config.GATEWAY_SW_FACTORY || ''
    const from = await signer.getAddress()
    const swFactory = new RGSmartWalletFactory(swFactoryAddr)
    const { smartWalletAddress, nonce } = await swFactory.getSmartWalletNonce(
      from,
    )

    const msgParams = JSON.stringify({
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
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
    })

    const params = [from, msgParams]
    const method = 'eth_signTypedData_v4'

    const signature = await provider.send(method, params)

    const forwardRequest: ForwardRequestStruct = {
      from: from,
      nonce: nonce!,
      executor: executor,
    }

    const suffixData = ethers.constants.Zero

    return fn(suffixData, forwardRequest, signature, ...args)
  }
}

export { RGSigner }
