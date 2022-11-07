import { Store } from './Store'

const key = 'BITCOIN_NETWORK'
const BitcoinStore = new Store(key)

type BitcoinNetworkObjectType = {
  name: string
  bips: Array<string>
}
export type BitcoinNetworkType = {
  [key: string]: BitcoinNetworkObjectType
}

const BitcoinNetworkStore = {
  getStoredNetworks: async (): Promise<BitcoinNetworkType> => {
    return (await BitcoinStore.get()) || {}
  },
  addNewNetwork: async (
    networkName: string,
    bips: Array<string> = [],
  ): Promise<BitcoinNetworkObjectType> => {
    const currentNetworks = await BitcoinNetworkStore.getStoredNetworks()
    const network = {
      name: networkName,
      bips,
    }

    currentNetworks[networkName] = network
    await BitcoinStore.set(currentNetworks)
    return network
  },
  deleteNetwork: async (networkName: string): Promise<boolean> => {
    const currentNetworks = await BitcoinNetworkStore.getStoredNetworks()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [networkName]: removed, ...newNetworks } = currentNetworks
    await BitcoinStore.set(newNetworks)
    return true
  },
}

export default BitcoinNetworkStore
