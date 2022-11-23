import { BigNumber, BigNumberish } from 'ethers'

export type RGListing = {}

export type IRIFGateway = {
  getServices(): Promise<IRGService[]>
}

export type IRGService = {
  getListings(): Promise<RGListing[]>
  getBalance(address: string): Promise<BigNumber>
  getServiceProviderName(): Promise<string>
  getListingCount(): Promise<BigNumber>
}

export type IRGLendingService = {
  lend(amount: BigNumber, listingId: BigNumber): Promise<void>
}

export type IRGBorrowService = {}

export type PromiseOrValue<T> = T | Promise<T>

export type ForwardRequestStruct = {
  from: PromiseOrValue<string>
  nonce: PromiseOrValue<BigNumberish>
  executor: PromiseOrValue<string>
}
