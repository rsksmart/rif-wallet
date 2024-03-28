import { Core } from '@walletconnect/core'
import { Web3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet'
import { getSdkError, buildApprovedNamespaces } from '@walletconnect/utils'

import { ChainID } from 'lib/eoaWallet'

import { getEnvSetting } from 'core/config'
import { SETTINGS } from 'core/types'
import { AcceptedValue, MMKVStorage } from 'storage/MMKVStorage'

const WC2 = 'WC2'

export type WalletConnect2SdkErrorString = Parameters<typeof getSdkError>[0]

const WalletConnect2SdkErrorEnum: { [P in WalletConnect2SdkErrorString]: P } = {
  USER_DISCONNECTED: 'USER_DISCONNECTED',
  UNSUPPORTED_EVENTS: 'UNSUPPORTED_EVENTS',
  UNSUPPORTED_CHAINS: 'UNSUPPORTED_CHAINS',
  UNSUPPORTED_NAMESPACE_KEY: 'UNSUPPORTED_NAMESPACE_KEY',
  USER_REJECTED: 'USER_REJECTED',
  INVALID_EVENT: 'INVALID_EVENT',
  INVALID_EXTEND_REQUEST: 'INVALID_EXTEND_REQUEST',
  INVALID_METHOD: 'INVALID_METHOD',
  INVALID_SESSION_SETTLE_REQUEST: 'INVALID_SESSION_SETTLE_REQUEST',
  INVALID_UPDATE_REQUEST: 'INVALID_UPDATE_REQUEST',
  UNAUTHORIZED_EVENT: 'UNAUTHORIZED_EVENT',
  UNAUTHORIZED_EXTEND_REQUEST: 'UNAUTHORIZED_EXTEND_REQUEST',
  UNAUTHORIZED_METHOD: 'UNAUTHORIZED_METHOD',
  UNAUTHORIZED_UPDATE_REQUEST: 'UNAUTHORIZED_UPDATE_REQUEST',
  UNSUPPORTED_ACCOUNTS: 'UNSUPPORTED_ACCOUNTS',
  UNSUPPORTED_METHODS: 'UNSUPPORTED_METHODS',
  USER_REJECTED_CHAINS: 'USER_REJECTED_CHAINS',
  USER_REJECTED_EVENTS: 'USER_REJECTED_EVENTS',
  USER_REJECTED_METHODS: 'USER_REJECTED_METHODS',
  WC_METHOD_UNSUPPORTED: 'WC_METHOD_UNSUPPORTED',
  SESSION_SETTLEMENT_FAILED: 'SESSION_SETTLEMENT_FAILED',
}

type StorageTypeFromCore = InstanceType<typeof Core>['storage']

export const deleteWCSessions = () => {
  const storage = new MMKVStorage('WC2')
  storage.deleteAll()
}

class MMKVCoreStorage implements StorageTypeFromCore {
  storage = new MMKVStorage(WC2)

  getEntries<T = never>(): Promise<[string, T][]> {
    const keys = this.storage.getAllKeys()
    const values: [string, T][] = keys.map(key => [
      key,
      this.storage.get(key) as T,
    ])
    return Promise.resolve(values)
  }

  getItem<T = never>(key: string): Promise<T | undefined> {
    return this.storage.get(key)
  }

  getKeys(): Promise<string[]> {
    return Promise.resolve(this.storage.getAllKeys())
  }

  removeItem(key: string): Promise<void> {
    this.storage.delete(key)
    return Promise.resolve(undefined)
  }

  setItem<T = object>(key: string, value: T): Promise<void> {
    this.storage.set(key, value as AcceptedValue)
    return Promise.resolve(undefined)
  }
}

export const createWeb3Wallet = async () => {
  const projectId = getEnvSetting(SETTINGS.WALLETCONNECT2_PROJECT_ID) // this should change if we need to vary from testnet/mainnet by using getWalletSetting
  const core = new Core({
    projectId,
    storage: new MMKVCoreStorage(),
    // logger: 'info', // info on this: https://github.com/pinojs/pino/blob/master/docs/api.md#levels
  })

  return await Web3Wallet.init({
    core,
    metadata: {
      name: 'RIF Wallet',
      description: 'RIF Wallet',
      url: 'https://www.rifos.org/',
      icons: [
        'https://user-images.githubusercontent.com/766679/236442723-004fc7a5-edb2-4477-86da-0b687d62702f.svg',
      ],
    },
  })
}

const WALLETCONNECT_SUPPORTED_METHODS = [
  'eth_sendTransaction',
  'personal_sign',
  'eth_signTransaction',
  'eth_signTypedData',
]

const WALLETCONNECT_BUILD_SUPPORTED_CHAINS = (chainId: ChainID) => [
  `eip155:${chainId}`,
]

const WALLETCONNECT_BUILD_SUPPORTED_ACCOUNTS = ({
  walletAddress,
  chainId,
}: {
  walletAddress: string
  chainId: ChainID
}) => [`eip155:${chainId}:${walletAddress}`]

const WALLETCONNECT_SUPPORTED_EVENTS = ['accountsChanged', 'chainChanged']

export const buildRskAllowedNamespaces = ({
  proposal,
  chainId,
  walletAddress,
}: {
  proposal: Web3WalletTypes.SessionProposal
  chainId: ChainID
  walletAddress: string
}) =>
  buildApprovedNamespaces({
    proposal: proposal.params,
    supportedNamespaces: {
      eip155: {
        chains: WALLETCONNECT_BUILD_SUPPORTED_CHAINS(chainId),
        methods: WALLETCONNECT_SUPPORTED_METHODS,
        events: WALLETCONNECT_SUPPORTED_EVENTS,
        accounts: WALLETCONNECT_BUILD_SUPPORTED_ACCOUNTS({
          walletAddress,
          chainId,
        }),
      },
    },
  })

export const rskWalletConnectNamespace = {
  eip155: {
    chains: ['eip155:31', 'eip155:30'],
    methods: [
      'eth_sendTransaction',
      'personal_sign',
      'eth_signTransaction',
      'eth_sign',
      'eth_signTypedData',
      'eth_signTypedData_v4',
    ],
    events: ['chainChanged', 'accountsChanged'],
  },
}

// Function that will only allow a proposal to connect to our chainId
export const getProposalErrorComparedWithRskNamespace = (
  proposal: Web3WalletTypes.SessionProposal,
): WalletConnect2SdkErrorString | void => {
  const {
    params: { requiredNamespaces, optionalNamespaces },
  } = proposal
  // Check if namespace has eip155
  if (!requiredNamespaces.eip155 && !optionalNamespaces.eip155) {
    return WalletConnect2SdkErrorEnum.UNSUPPORTED_NAMESPACE_KEY
  }
  // Check if chains includes EIP155:31 OR EIP155:30
  if (
    !requiredNamespaces.eip155?.chains?.every(chain =>
      rskWalletConnectNamespace.eip155.chains.includes(chain),
    ) &&
    !optionalNamespaces.eip155?.chains?.every(chain =>
      rskWalletConnectNamespace.eip155.chains.includes(chain),
    )
  ) {
    return WalletConnect2SdkErrorEnum.UNSUPPORTED_CHAINS
  }
  // Check if the methods that RSK allows are present
  if (
    !requiredNamespaces.eip155?.methods?.every(
      method => rskWalletConnectNamespace.eip155.methods.indexOf(method) > -1,
    ) &&
    !optionalNamespaces.eip155?.methods?.every(
      method => rskWalletConnectNamespace.eip155.methods.indexOf(method) > -1,
    )
  ) {
    return WalletConnect2SdkErrorEnum.UNSUPPORTED_METHODS
  }
  // Check if the events that RSK allows are present
  if (
    !requiredNamespaces.eip155?.events.every(
      event => rskWalletConnectNamespace.eip155.events.indexOf(event) > -1,
    ) &&
    !optionalNamespaces.eip155?.events.every(
      event => rskWalletConnectNamespace.eip155.events.indexOf(event) > -1,
    )
  ) {
    return WalletConnect2SdkErrorEnum.UNSUPPORTED_EVENTS
  }
}
