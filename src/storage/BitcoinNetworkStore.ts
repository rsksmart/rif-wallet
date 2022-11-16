import { MainStorage } from './MainStorage'

const key = 'BITCOIN_NETWORK'

export interface StoredBitcoinNetworkValue {
  name: string
  bips: string[]
}

export interface StoredBitcoinNetworks {
  [key: string]: StoredBitcoinNetworkValue
}

export const BitcoinNetworkStore = {
  getStoredNetworks: (): StoredBitcoinNetworks => {
    return MainStorage.get(key) || {}
  },
  addNewNetwork: (networkName: string, bips: Array<string> = []) => {
    const currentNetworks = BitcoinNetworkStore.getStoredNetworks()
    const network = {
      name: networkName,
      bips,
    }

    currentNetworks[networkName] = network
    MainStorage.set(key, currentNetworks)
    return network
  },
  deleteNetwork: (networkName: string): boolean => {
    const currentNetworks = BitcoinNetworkStore.getStoredNetworks()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [networkName]: removed, ...newNetworks } = currentNetworks
    MainStorage.set(key, newNetworks)
    return true
  },
}
