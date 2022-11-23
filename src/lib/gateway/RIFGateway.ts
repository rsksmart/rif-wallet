import Config from 'react-native-config'
import { Contract, ethers } from 'ethers'
import { IRIFGatewayABI } from './ABIs'
import { IRIFGateway, IRGService } from './types'

class RIFGateway implements IRIFGateway {
  contract: Contract

  constructor(
    RIFGatewayAddress: string,
    provider: ethers.providers.Web3Provider,
  ) {
    this.contract = new ethers.Contract(
      RIFGatewayAddress,
      IRIFGatewayABI.abi,
      provider,
    )
  }

  async getServices(): Promise<IRGService[]> {
    return await this.contract.functions['getServices()']()
  }
}

console.log('addr of gatewaty', Config.GATEWAY_ADDRESS)

const DefaultRIFGateway = (provider: ethers.providers.Web3Provider) =>
  new RIFGateway(Config.GATEWAY_ADDRESS || '', provider)

export { RIFGateway, DefaultRIFGateway }
