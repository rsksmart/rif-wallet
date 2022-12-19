import { BigNumber, BigNumberish } from 'ethers'

export enum RGSERVICE_TYPE {
  LENDING,
  BORROWING,
  UNDEFINED,
}

export enum IRGListingAction {
  LEND,
  BORROW,
  PAY,
  WITHDRAW,
}

export type IRGListing = {
  id: BigNumber
  minAmount: BigNumber
  maxAmount: BigNumber
  minDuration: BigNumber
  maxDuration: BigNumber
  interestRate: BigNumber
  loanToValueCurrency: string
  currency: string
  payBackOption: BigNumber
  enabled: boolean
  name: string
  type: RGSERVICE_TYPE
  currencyName: string
  currencySymbol: string
  service: string
  balance?: BigNumber
  validated: boolean
}

export type IRIFGateway = {
  getServicesAndProviders(): Promise<[string[], string[]]>
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

export type RGSubscription = {
  service: string
  listing: BigNumber
}

export type PromiseOrValue<T> = T | Promise<T>

export type ForwardRequestStruct = {
  from: PromiseOrValue<string>
  nonce: PromiseOrValue<BigNumberish>
  executor: PromiseOrValue<string>
}
