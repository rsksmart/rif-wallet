import { MainStorage } from './MainStorage'

const getLastAddressIndexPrefix = (networkName: string, bipName: string) =>
  `${networkName}_${bipName}_LAST_ADDRESS_INDEX`

// @todo implement abstraction when user wants to receive bitcoin
export const BitcoinNetworkAddressStore = {
  getLastAddressUsedIndex: (networkName: string, bipName: string): number => {
    const lastAddress = MainStorage.get(
      getLastAddressIndexPrefix(networkName, bipName),
    )
    if (!lastAddress) {
      return 0
    }
    return parseInt(lastAddress, 10)
  },
  saveLastAddressUsedIndex: (
    networkName: string,
    bipName: string,
    index: number,
  ): number => {
    MainStorage.set(
      getLastAddressIndexPrefix(networkName, bipName),
      index.toString(),
    )
    return index
  },
}
