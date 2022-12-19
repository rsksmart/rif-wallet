import { ERC20ABI } from './ABIs'
import { Contract, ethers, BigNumber } from 'ethers'

export class Token {
  contract: Contract
  address: string
  name?: string
  symbol?: string

  constructor(
    address: string,
    provider: ethers.providers.Web3Provider | ethers.Signer,
  ) {
    this.contract = new Contract(address, ERC20ABI.abi, provider)
    this.address = address
  }

  async fetchInformation() {
    this.name = await this.contract.functions['name()']()
    this.symbol = await this.contract.functions['symbol()']()
  }

  async approve(address: string, amount: BigNumber) {
    return await this.contract.functions['approve(address,uint256)'](address, amount);
  }
}
