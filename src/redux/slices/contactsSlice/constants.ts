import { Contact } from 'shared/types'
import { TESTNET, MAINNET } from 'screens/rnsManager/addresses.json'

export const testnetContacts: Record<string, Contact> = {
  [TESTNET.rBTCFaucet]: {
    address: TESTNET.rBTCFaucet,
    name: 'rBTC Faucet',
    displayAddress: TESTNET.rBTCFaucet,
    isEditable: false,
  },
  [TESTNET.rifFaucet]: {
    address: TESTNET.rifFaucet,
    name: 'RIF Faucet',
    displayAddress: TESTNET.rifFaucet,
    isEditable: false,
  },
  [TESTNET.fifsAddrRegistrarAddress]: {
    address: TESTNET.fifsAddrRegistrarAddress,
    name: 'RNS Manager',
    displayAddress: TESTNET.fifsAddrRegistrarAddress,
    isEditable: false,
  },
  [TESTNET.rifTokenAddress]: {
    address: TESTNET.rifTokenAddress,
    name: 'RIF Token',
    displayAddress: TESTNET.rifTokenAddress,
    isEditable: false,
  },
  [TESTNET.rnsRegistryAddress]: {
    address: TESTNET.rnsRegistryAddress,
    name: 'RNS Registry',
    displayAddress: TESTNET.rnsRegistryAddress,
    isEditable: false,
  },
  [TESTNET.rskOwnerAddress]: {
    address: TESTNET.rskOwnerAddress,
    name: 'RSK Owner',
    displayAddress: TESTNET.rskOwnerAddress,
    isEditable: false,
  },
  [TESTNET.rifWalletDeployment]: {
    address: TESTNET.rifWalletDeployment,
    name: 'RIF Wallet Deployment',
    displayAddress: TESTNET.rifWalletDeployment,
    isEditable: false,
  },
}

export const mainnetContacts: Record<string, Contact> = {
  [MAINNET.fifsAddrRegistrarAddress]: {
    address: MAINNET.fifsAddrRegistrarAddress,
    name: 'RNS Manager',
    displayAddress: MAINNET.fifsAddrRegistrarAddress,
    isEditable: false,
  },
  [MAINNET.rifTokenAddress]: {
    address: MAINNET.rifTokenAddress,
    name: 'RIF Token',
    displayAddress: MAINNET.rifTokenAddress,
    isEditable: false,
  },
  [MAINNET.rnsRegistryAddress]: {
    address: MAINNET.rnsRegistryAddress,
    name: 'RNS Registry',
    displayAddress: MAINNET.rnsRegistryAddress,
    isEditable: false,
  },
  [MAINNET.rskOwnerAddress]: {
    address: MAINNET.rskOwnerAddress,
    name: 'RSK Owner',
    displayAddress: MAINNET.rskOwnerAddress,
    isEditable: false,
  },
  [MAINNET.rifWalletDeployment]: {
    address: MAINNET.rifWalletDeployment,
    name: 'RIF Wallet Deployment',
    displayAddress: MAINNET.rifWalletDeployment,
    isEditable: false,
  },
}
