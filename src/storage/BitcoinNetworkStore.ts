import { MainStorage } from './MainStorage'

const key = 'BITCOIN_NETWORK'

export interface BitcoinNetworks {
  [key: string]: {
    name: string
    bips: Array<string>
  }
}

export const BitcoinNetworkStore = {
  getStoredNetworks: (): BitcoinNetworks => {
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
