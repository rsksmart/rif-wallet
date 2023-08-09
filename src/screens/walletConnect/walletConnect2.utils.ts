import { Core } from '@walletconnect/core'
import { Web3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet'
import { getSdkError } from '@walletconnect/utils'

import { getEnvSetting } from 'core/config'
import { SETTINGS } from 'core/types'

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

export const createWeb3Wallet = async () => {
  const projectId = getEnvSetting(SETTINGS.WALLETCONNECT2_PROJECT_ID) // this should change if we need to vary from testnet/mainnet by using getWalletSetting
  const core = new Core({
    projectId,
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

export const rskWalletConnectNamespace = {
  eip155: {
    chains: ['eip155:30', 'eip155:31'],
    methods: ['eth_sendTransaction', 'personal_sign'],
    events: ['chainChanged', 'accountsChanged'],
  },
}

// Function that will only allow a proposal to connect to our chainId
export const getProposalErrorComparedWithRskNamespace = (
  proposal: Web3WalletTypes.SessionProposal,
): WalletConnect2SdkErrorString | void => {
  const {
    params: { requiredNamespaces },
  } = proposal
  // Check if namespace has eip155
  if (!requiredNamespaces.eip155) {
    return WalletConnect2SdkErrorEnum.UNSUPPORTED_NAMESPACE_KEY
  }
  // Check if chains includes EIP155:31 OR EIP155:30
  if (
    !requiredNamespaces.eip155.chains?.every(chain =>
      rskWalletConnectNamespace.eip155.chains.includes(chain),
    )
  ) {
    return WalletConnect2SdkErrorEnum.UNSUPPORTED_CHAINS
  }
  // Check if the methods that RSK allows are present
  if (
    !requiredNamespaces.eip155.methods?.every(
      method => rskWalletConnectNamespace.eip155.methods.indexOf(method) > -1,
    )
  ) {
    return WalletConnect2SdkErrorEnum.UNSUPPORTED_METHODS
  }
  // Check if the events that RSK allows are present
  if (
    !requiredNamespaces.eip155?.events.every(
      event => rskWalletConnectNamespace.eip155.events.indexOf(event) > -1,
    )
  ) {
    return WalletConnect2SdkErrorEnum.UNSUPPORTED_EVENTS
  }
}
