import {
  isAddress,
  isValidChecksumAddress,
  toChecksumAddress,
} from '@rsksmart/rsk-utils'

export enum AddressValidationMessage {
  INVALID_ADDRESS = 'Invalid address',
  INVALID_CHECKSUM = 'Invalid checksum',
  DOMAIN = 'Domain Found',
  NO_ADDRESS_DOMAIN = 'Domain without address',
  VALID = '',
}

export const isDomain = (text: string) => {
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
export const validateAddress = (address: string, chainId = 31) => {
  if (isDomain(address)) {
    return AddressValidationMessage.DOMAIN
  }

  if (!address) {
    return AddressValidationMessage.INVALID_ADDRESS
  }

  if (!isAddress(address)) {
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

export { toChecksumAddress }
