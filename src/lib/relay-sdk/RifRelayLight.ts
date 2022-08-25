import { SDKAddresses } from './types'

export class RifRelayLight {
  private chainId: number
  private provider: any // Ethers Provider
  private addresses: SDKAddresses

  constructor(provider: any, addresses: SDKAddresses, chainId: number) {
    this.provider = provider
    this.addresses = addresses
    this.chainId = chainId
  }

  createRelayRequest = () => {
    console.log('creating relay request...')
  }
}
