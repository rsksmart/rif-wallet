import { MMKVStorage } from './MMKVStorage'

const key = 'BITCOIN_NETWORK'
const BitcoinStore = new MMKVStorage(key)

export interface BitcoinNetworks {
  [key: string]: {
    name: string
    bips: Array<string>
  }
}

export const BitcoinNetworkStore = {
  getStoredNetworks: (): BitcoinNetworks => {
    return BitcoinStore.get() || {}
  },
  addNewNetwork: (networkName: string, bips: Array<string> = []) => {
    const currentNetworks = BitcoinNetworkStore.getStoredNetworks()
    const network = {
      name: networkName,
      bips,
    }

    currentNetworks[networkName] = network
    BitcoinStore.set(currentNetworks)
    return network
  },
  deleteNetwork: (networkName: string): boolean => {
    const currentNetworks = BitcoinNetworkStore.getStoredNetworks()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [networkName]: removed, ...newNetworks } = currentNetworks
    BitcoinStore.set(newNetworks)
    return true
  },
}
