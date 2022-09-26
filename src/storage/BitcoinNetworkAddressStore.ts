import AsyncStorage from '@react-native-async-storage/async-storage'

const getLastAddressIndexPrefix = (networkName: string, bipName: string) =>
  `${networkName}_${bipName}_LAST_ADDRESS_INDEX`
// @todo implement abstraction when user wants to receive bitcoin
const BitcoinNetworkAddressStore = {
  getLastAddressUsedIndex: async (
    networkName: string,
    bipName: string,
  ): Promise<number> => {
    const lastAddress = await AsyncStorage.getItem(
      getLastAddressIndexPrefix(networkName, bipName),
    )
    if (!lastAddress) {
      return 0
    }
    return parseInt(lastAddress, 10)
  },
  saveLastAddressUsedIndex: async (
    networkName: string,
    bipName: string,
    index: number,
  ): Promise<number> => {
    await AsyncStorage.setItem(
      getLastAddressIndexPrefix(networkName, bipName),
      index.toString(),
    )
    return index
  },
}

export default BitcoinNetworkAddressStore
