import { Contract, ethers } from 'ethers'
import { IRIFGatewayABI } from './ABIs'
import { IRIFGateway, RGService } from './types'

class RIFGateway implements IRIFGateway {
  contract: Contract

  constructor(RIFGatewayAddress: string) {
    this.contract = new ethers.Contract(RIFGatewayAddress, IRIFGatewayABI.abi)
  }

  async getServices(): Promise<RGService[]> {
    return await this.contract.functions['getServices()']()
  }
}

export { RIFGateway }
