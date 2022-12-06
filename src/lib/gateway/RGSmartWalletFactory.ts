import { BigNumber, Contract, ethers } from 'ethers'
import { ISmartWalletFactoryABI, SmartWalletABI } from './ABIs'

class RGSmartWalletFactory {
  contract: Contract
  provider: ethers.providers.Web3Provider

  constructor(address: string, provider: ethers.providers.Web3Provider) {
    this.contract = new ethers.Contract(
      address,
      ISmartWalletFactoryABI.abi,
      provider,
    )
    this.provider = provider
  }

  async getSmartWalletAddress(owner: string): Promise<string> {
    return await this.contract.functions['getSmartWalletAddress(address)'](
      owner,
    )
  }

  async getSmartWalletNonce(
    owner: string,
  ): Promise<{ smartWalletAddress: string; nonce: BigNumber }> {
    const smartWalletAddress = (await this.getSmartWalletAddress(owner))[0]
    const isDeployed =
      (await this.provider.getCode(smartWalletAddress)) !== '0x'

    let nonce = ethers.constants.Zero

    if (isDeployed) {
      const smartWallet = new ethers.Contract(
        smartWalletAddress,
        SmartWalletABI.abi,
        this.provider,
      )
      nonce = await smartWallet.functions['nonce()']()
    }

    return {
      smartWalletAddress,
      nonce,
    }
  }
}

export { RGSmartWalletFactory }
