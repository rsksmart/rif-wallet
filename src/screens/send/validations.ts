const rskUtils = require('rskjs-util')
const { isValidAddress, isValidChecksumAddress } = rskUtils

/**
 * validate addresses according to rskip-60
 * https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md
 * @param {string} address to validate
 * @param {number} chainId defined in erip-155
 * @returns {string} null if it's valid and an error message if it is not
 */
export const validateAddress = (address: string, chainId = 31) => {
  if (!isValidAddress(address)) {
    return 'Invalid address'
  }
  if (
    !isValidChecksumAddress(address, chainId) &&
    address !== address.toLowerCase()
  ) {
    return 'Invalid checksum'
  }
  return null
}
