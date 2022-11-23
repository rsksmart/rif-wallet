import { BigNumber, BigNumberish } from 'ethers'

export type IRGListing = {
  id: BigNumber
  minAmount: BigNumber
  maxAmount: BigNumber
  minDuration: BigNumber
  maxDuration: BigNumber
  interestRate: BigNumber
  loanToValueCurrency: BigNumber
  currency: BigNumber
  payBackOption: BigNumber
  enabled: boolean
  name: string
}

export type IRIFGateway = {
  getServices(): Promise<IRGService[]>
}

export type IRGService = {
  getListings(): Promise<IRGListing[]>
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
