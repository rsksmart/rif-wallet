import { BigNumber, Contract, ethers } from 'ethers'
import { ISmartWalletFactoryABI, SmartWalletABI } from './ABIs'

class RGSmartWalletFactory {
  contract: Contract

  constructor(address: string) {
    this.contract = new ethers.Contract(address, ISmartWalletFactoryABI.abi)
  }

  async getSmartWalletAddress(owner: string): Promise<string> {
    return await this.contract.functions['getSmartWalletAddress(address)'](
      owner,
    )
  }

  async getSmartWalletNonce(
    owner: string,
  ): Promise<{ smartWalletAddress: string; nonce: BigNumber }> {
    const smartWalletAddress = await this.getSmartWalletAddress(owner)
    const smartWallet = new ethers.Contract(
      smartWalletAddress,
      SmartWalletABI.abi,
    )
    const nonce = await smartWallet.functions['nonce()']()

    return {
      smartWalletAddress,
      nonce,
    }
  }
}

export { RGSmartWalletFactory }
