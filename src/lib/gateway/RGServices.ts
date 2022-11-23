import { BigNumber, Contract, ethers, Signer } from 'ethers'
import { IServiceABI } from './ABIs'
import { RGSigner } from './RGSigner'
import { IRGService, IRGListing } from './types'

class RGService implements IRGService {
  contract: Contract
  contractAddress: string

  constructor(serviceAddress: string) {
    this.contractAddress = serviceAddress
    this.contract = new ethers.Contract(serviceAddress, IServiceABI.abi)
  }

  async getListings(): Promise<IRGListing[]> {
    const listingsCount = await this.getListingCount()
    const listings: IRGListing[] = []

    for (let i = 0; i < listingsCount.toNumber(); i++) {
      listings.push(this.contract.functions['getListing(uint256)'](i))
    }

    return listings
  }

  async getBalance(address: string): Promise<BigNumber> {
    return await this.contract.functions['getBalance(address)'](address)
  }

  async getServiceProviderName(): Promise<string> {
    return await this.contract.functions['getServiceProviderName()']()
  }

  async getListingCount(): Promise<BigNumber> {
    return await this.contract.functions['getListingsCount()']()
  }
}

class RGLendingService extends RGService {
  signer: Signer
  provider: ethers.providers.Web3Provider

  constructor(
    address: string,
    signer: Signer,
    provider: ethers.providers.Web3Provider,
  ) {
    super(address)

    this.contract = this.contract.connect(signer)
    this.signer = signer
    this.provider = provider
  }

  async lend(amount: BigNumber, listingId: BigNumber): Promise<void> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      '31',
      this.contract.functions[
        'lend(bytes32,(address,uint256,address),bytes,uint256,uint256)'
      ],
      [amount, listingId],
    )
  }

  async withdraw(): Promise<void> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      '31',
      this.contract.functions[
        'withdraw(bytes32,(address,uint256,address),bytes)'
      ],
      [],
    )
  }
}

class RGBorrowingService extends RGService {
  signer: Signer
  provider: ethers.providers.Web3Provider

  constructor(
    address: string,
    signer: Signer,
    provider: ethers.providers.Web3Provider,
  ) {
    super(address)

    this.contract = this.contract.connect(signer)
    this.signer = signer
    this.provider = provider
  }

  async borrow(amount: BigNumber, listingId: BigNumber): Promise<void> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      '31',
      this.contract.functions[
        'borrow(bytes32,(address,uint256,address),bytes,uint256,uint256,uint256)'
      ],
      [amount, ethers.constants.Zero, listingId],
    )
  }

  async pay(amount: BigNumber, listingId: BigNumber): Promise<void> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      '31',
      this.contract.functions[
        'pay(bytes32,(address,uint256,address),bytes,uint256,uint256)'
      ],
      [amount, listingId],
    )
  }

  async withdraw(currencyAddress: string): Promise<void> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      '31',
      this.contract.functions[
        'withdraw(bytes32,(address,uint256,address),bytes,address)'
      ],
      [currencyAddress],
    )
  }
}

export { RGService, RGLendingService, RGBorrowingService }
