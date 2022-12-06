import { BigNumber, BigNumberish, Contract, ethers, Signer } from 'ethers'
import { IServiceABI, LendingServiceABI } from './ABIs'
import { RGSigner } from './RGSigner'
import { Token } from './Token'
import { IRGService, IRGListing, RGSERVICE_TYPE } from './types'

class RGService implements IRGService {
  contract: Contract
  address: string
  contractAddress: string
  serviceType: RGSERVICE_TYPE
  provider: ethers.providers.Web3Provider | ethers.Signer

  constructor(
    address: string,
    provider: ethers.providers.Web3Provider | ethers.Signer,
  ) {
    this.contractAddress = address
    this.contract = new ethers.Contract(address, IServiceABI.abi, provider)
    this.provider = provider
    this.serviceType = RGSERVICE_TYPE.UNDEFINED
    this.address = address
    this.contract.functions['serviceType()']().then(interfaceId => {
      this.serviceType =
        interfaceId[0] === '0xd9eedeca'
          ? RGSERVICE_TYPE.LENDING
          : RGSERVICE_TYPE.BORROWING
    })
  }

  async getListing(listingId: BigNumberish): Promise<IRGListing> {
    const listing = (
      await this.contract.functions['getListing(uint256)'](listingId)
    )[0]

    const currency = listing[7]
    let tokenName = ''
    let tokenSymbol = ''

    if (currency === ethers.constants.AddressZero) {
      tokenName = 'RBTC'
      tokenSymbol = 'RTBC'
    } else {
      const token = new Token(currency, this.provider)
      await token.fetchInformation()
      tokenName = token.name!
      tokenSymbol = token.symbol!
    }

    return {
      id: listing[0],
      minAmount: listing[1],
      maxAmount: listing[2],
      minDuration: listing[3],
      maxDuration: listing[4],
      interestRate: listing[5],
      loanToValueCurrency: listing[6],
      currency: listing[7],
      payBackOption: listing[8],
      enabled: listing[9],
      name: listing[10],
      type: this.serviceType,
      currencyName: tokenName,
      currencySymbol: tokenSymbol,
      service: this.address,
    } as IRGListing
  }

  async getListings(): Promise<IRGListing[]> {
    const listingsCount = await this.getListingCount()
    const listings: IRGListing[] = []

    for (let i = 0; i < +listingsCount; i++) {
      listings.push(await this.getListing(i))
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
    super(address, provider)

    this.contract = new ethers.Contract(address, LendingServiceABI.abi, signer)
    this.signer = signer
    this.provider = provider
  }

  async lend(
    amount: BigNumber,
    listingId: BigNumber,
    signFn: (domain: any, types: any, value: any) => Promise<any>,
    chainId: string,
  ): Promise<any> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      chainId,
      signFn,
      this.contract.functions[
        'lend(bytes32,(address,uint256,address),bytes,uint256,uint256)'
      ],
      [
        amount,
        listingId,
        {
          value: amount,
        },
      ],
    )
  }

  async withdraw(
    signFn: (domain: any, types: any, value: any) => Promise<any>,
    chainId: string,
  ): Promise<any> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      chainId,
      signFn,
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
    super(address, provider)

    this.contract = new ethers.Contract(address, LendingServiceABI.abi, signer)
    this.signer = signer
    this.provider = provider
  }

  async borrow(
    amount: BigNumber,
    listingId: BigNumber,
    signFn: (domain: any, types: any, value: any) => Promise<any>,
    chainId: string,
  ): Promise<void> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      chainId,
      signFn,
      this.contract.functions[
        'borrow(bytes32,(address,uint256,address),bytes,uint256,uint256,uint256)'
      ],
      [amount, ethers.constants.Zero, listingId],
    )
  }

  async pay(
    amount: BigNumber,
    listingId: BigNumber,
    signFn: (domain: any, types: any, value: any) => Promise<any>,
    chainId: string,
  ): Promise<void> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      chainId,
      signFn,
      this.contract.functions[
        'pay(bytes32,(address,uint256,address),bytes,uint256,uint256)'
      ],
      [amount, listingId],
    )
  }

  async withdraw(
    currencyAddress: string,
    signFn: (domain: any, types: any, value: any) => Promise<any>,
    chainId: string,
  ): Promise<void> {
    return await RGSigner.executeTransaction(
      this.signer,
      this.provider,
      this.contractAddress,
      chainId,
      signFn,
      this.contract.functions[
        'withdraw(bytes32,(address,uint256,address),bytes,address)'
      ],
      [currencyAddress],
    )
  }
}

export { RGService, RGLendingService, RGBorrowingService }
