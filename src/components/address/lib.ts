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

/**
 * validate addresses according to rskip-60
 * https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md
 * @param {string} address to validate
 * @param {number} chainId defined in erip-155
 * @returns {string} null if it's valid and an error message if it is not
 */
export const validateAddress = (address: string, chainId = 31) => {
  const re = /\.rsk$/ // match *.rsk domains
  const isDomain = re.test(String(address).toLowerCase())
  if (isDomain) {
    return AddressValidationMessage.DOMAIN
  }

  if (!address) {
    return AddressValidationMessage.VALID
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
