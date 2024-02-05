import {
  isAddress,
  isValidChecksumAddress,
  toChecksumAddress,
} from '@rsksmart/rsk-utils'

import { shortAddress } from 'lib/utils'
import { ChainID } from 'lib/eoaWallet'

export enum AddressValidationMessage {
  INVALID_ADDRESS = 'Invalid address',
  INVALID_CHECKSUM = 'Invalid checksum',
  WRONG_NETWORK = 'Wrong network',
  DOMAIN = 'Domain Found',
  NO_ADDRESS_DOMAIN = 'Domain without address',
  VALID = '',
}

/**
 * This will validate if the text is a valid RNS Domain (matches *.rsk)
 * @param text
 */
export const isDomain = (text: string): boolean => {
  const re = /\.rsk$/ // match *.rsk domains
  return re.test(String(text).toLowerCase())
}
/**
 * validate addresses according to rskip-60
 * https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md
 * @param {string} address to validate
 * @param {number} chainId defined in erip-155
 * @returns {string} null if it's valid and an error message if it is not
 */
export const validateAddress = (
  address: string,
  chainId = 31,
): AddressValidationMessage => {
  if (isDomain(address)) {
    return AddressValidationMessage.DOMAIN
  }

  if (!address || !isAddress(address)) {
    return AddressValidationMessage.INVALID_ADDRESS
  }

  if (
    !isValidChecksumAddress(address, chainId) &&
    address !== address.toLowerCase()
  ) {
    return AddressValidationMessage.INVALID_CHECKSUM
  }

  return AddressValidationMessage.VALID
}

export const isMyAddress = (
  userAddress: string,
  compareAddress: string,
): boolean => {
  const myAddress = toChecksumAddress(userAddress)
  return myAddress.toLowerCase() === compareAddress.toLowerCase()
}

export const getAddressDisplayText = (
  inputAddress: string,
  chainId: ChainID,
) => {
  const checksumAddress = toChecksumAddress(inputAddress, chainId)
  const displayAddress = shortAddress(checksumAddress)
  return { checksumAddress, displayAddress }
}

export { toChecksumAddress }
