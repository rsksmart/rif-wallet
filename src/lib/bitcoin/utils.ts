import { BigNumber, utils } from 'ethers'
import { createBipFactoryType } from './types'
import BIPWithRequest from './BIPWithRequest'
import { OnRequest } from '../core'
import { validate, Network } from 'bitcoin-address-validation'

export function convertBtcToSatoshi(btc: string) {
  if (btc === '') {
    return utils.parseUnits('0', 8)
  }
  return utils.parseUnits(btc, 8)
}

export function convertSatoshiToBtcHuman(satoshi: number | string | BigNumber) {
  return utils.formatUnits(BigNumber.from(satoshi), 8)
}

export function isBitcoinAddressValid(
  addressToPay: string,
  network?: Network,
): boolean {
  return validate(addressToPay, network)
}

/**
 * Factory to create BIP With Request class with the arguments of BIP, creating an enhanced BIP With Request class
 * that has to be initialized with a OnRequest type request
 * @param args
 */
export const createBipWithRequest = (...args: createBipFactoryType) =>
  new BIPWithRequest(...args)

/**
 * Initializes an array of BIPWithRequest with the request and the bip
 * @param request {OnRequest}
 * @param bip {BIPWithRequest}
 */
export const initializeBipWithRequest = (
  request: OnRequest,
  bip: BIPWithRequest,
) => bip.initialize(request)

/**
 * Creates and initializes the BIPWithRequest using currying - first creating a function that, when executed, receives a request
 * then returns another function that, when executed, will return a BIPWithRequest already initialized with the request
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

/**
 * Validates the amount (in satoshis) to pay with the balance available (in satoshis too)
 * @param satoshisToPay
 * @param balanceAvailable
 */
export const validateAmount = (
  satoshisToPay: BigNumber,
  balanceAvailable: BigNumber,
): { isValid: boolean; message: string } => {
  if (satoshisToPay.gt(balanceAvailable)) {
    return {
      isValid: false,
      message: `Amount must not be greater than ${convertSatoshiToBtcHuman(
        balanceAvailable,
      )}`,
    }
  }
  if (satoshisToPay.lte(0)) {
    return {
      isValid: false,
      message: 'Amount must not be less or equal to 0',
    }
  }
  return {
    isValid: true,
    message: '',
  }
}
