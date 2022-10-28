import { BigNumber, utils } from 'ethers'
import BIP from './BIP'
import { createBipFactoryType } from './types'
import BIPWithRequest from './BIPWithRequest'
import { OnRequest } from '../core'

export function convertBtcToSatoshi(btc: string) {
  return utils.parseUnits(btc, 8)
}

export function convertSatoshiToBtcHuman(satoshi: number | string | BigNumber) {
  return utils.formatUnits(BigNumber.from(satoshi), 8)
}

export function isBitcoinAddressValid(addressToPay: string, bip: BIP): boolean {
  return addressToPay.startsWith(bip.networkInfo.bech32)
}

/**
 * Factory to create BIP With Request class with the arguments of BIP plus the Request arguments, which are necessary.
 * @param args
 */
export const createBipWithRequest = (...args: createBipFactoryType) =>
  new BIPWithRequest(...args)

/**
 * Initializes an array of BIPWithRequest with the request passed as the first function (currying)
 * @param request {OnRequest}
 * @param bip {BIPWithRequest}
 */
export const initializeBipWithRequest = (
  request: OnRequest,
  bip: BIPWithRequest,
) => bip.initialize(request)

/**
 * Creates and initializes the BIPWithRequest
 * @param request
 * @returns BIPWithRequest
 */
export const createAndInitializeBipWithRequest =
  (request: OnRequest) =>
  (...args: createBipFactoryType) => {
    const bip = createBipWithRequest(...args)
    initializeBipWithRequest(request, bip)
    return bip
  }
