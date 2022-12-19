import Config from 'react-native-config'
import { Contract, ethers, Signer } from 'ethers'
import { RIFGatewayABI } from './ABIs'
import { IRIFGateway, IRGListing } from './types'
import { RGService } from './RGServices'

class RIFGateway implements IRIFGateway {
  address: string
  contract: Contract
  provider: ethers.providers.Web3Provider

  constructor(
    RIFGatewayAddress: string,
    provider: ethers.providers.Web3Provider,
  ) {
    this.address = RIFGatewayAddress
    this.provider = provider
    this.contract = new ethers.Contract(
      RIFGatewayAddress,
      RIFGatewayABI.abi,
      provider,
    )
  }

  async getServicesAndProviders(): Promise<[string[], string[]]> {
    return await this.contract.functions['getServicesAndProviders()']()
  }

  async getAllListings(): Promise<IRGListing[]> {
    const listings: IRGListing[] = []
    const services: string[] = (await this.getServicesAndProviders())[0]

    for (const serviceAddress of services) {
      try {
        console.log('Retrieving listings for service: ', serviceAddress)
        const service = new RGService(serviceAddress, this.provider)
        const serviceListings = await service.getListings()
        listings.push(...serviceListings)
      } catch (ex) {
        console.log('Failed to retrieve listings for service: ', serviceAddress)
      }
    }

    console.log('Retrieved', listings.length, 'listings')

    return listings
  }

  async getServiceSubscriptions(subscriber: Signer): Promise<IRGListing[]> {
    const listings: IRGListing[] = []

    console.log('Fetching subscriptions')
    const [subscriptions] = await this.contract.functions[
      'getSubscriptions(address)'
    ](await subscriber.getAddress())

    for (const [serviceAddress, listingId] of subscriptions) {
      try {
        const foundListing = listings.find(
          listing =>
            listing.id.eq(listingId) && listing.service === serviceAddress,
        )
        console.log('foundListing', foundListing)
        if (!foundListing) {
          const service = new RGService(serviceAddress, subscriber)
          const listing = await service.getListing(listingId)
          listing.balance = await service.getBalance(listing.currency)
          listings.push(listing)
        }
      } catch (ex) {
        console.log('Failed to retrieve listings for service: ', serviceAddress)
      }
    }

    return listings
  }
}

const DefaultRIFGateway = (provider: ethers.providers.Web3Provider) =>
  new RIFGateway(Config.GATEWAY_ADDRESS || '', provider)

export { RIFGateway, DefaultRIFGateway }
