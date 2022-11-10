import { isAddress } from '@rsksmart/rsk-utils'

interface DecodedString {
  address: string
  network?: string
}

/**
 * Decode an address or a EIP-681 string.
 * WIP and only returns the address and network. More work needed for additional fields
 * @param input string address string
 */
export const decodeString = (input: string): DecodedString => {
  // if only a string:
  if (isAddress(input)) {
    return { address: input }
  }

  // a network prefix and an address:
  if (input.indexOf(':')) {
    const array = input.split(':')
    let address = array[1]

    if (address.startsWith('pay-')) {
      address = address.replace('pay-', '')
    }

    if (isAddress(address.slice(0, 42))) {
      return {
        address: address.slice(0, 42),
        network: array[0],
      }
    }
  }

  // failed:
  return { address: '', network: '' }
}
