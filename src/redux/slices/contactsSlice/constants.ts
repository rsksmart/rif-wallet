import { Contact } from 'shared/types'
import addresses from 'screens/rnsManager/addresses.json'

export const defaultContacts: Record<string, Contact> = {
  [addresses.fifsAddrRegistrarAddress]: {
    address: addresses.fifsAddrRegistrarAddress,
    name: 'RNS Manager',
    displayAddress: addresses.fifsAddrRegistrarAddress,
    isEditable: false,
  },
  [addresses.rifTokenAddress]: {
    address: addresses.rifTokenAddress,
    name: 'RIF Token',
    displayAddress: addresses.rifTokenAddress,
    isEditable: false,
  },
  [addresses.rnsRegistryAddress]: {
    address: addresses.rnsRegistryAddress,
    name: 'RNS Registry',
    displayAddress: addresses.rnsRegistryAddress,
    isEditable: false,
  },
  [addresses.rskOwnerAddress]: {
    address: addresses.rskOwnerAddress,
    name: 'RSK Owner',
    displayAddress: addresses.rskOwnerAddress,
    isEditable: false,
  },
}
