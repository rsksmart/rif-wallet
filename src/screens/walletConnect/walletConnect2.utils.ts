import { Core } from '@walletconnect/core'
import { Web3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet'
import { getSdkError } from '@walletconnect/utils'

export type WalletConnect2SdkErrorString = Parameters<typeof getSdkError>[0]

export const createWeb3Wallet = async () => {
  const core = new Core({
    projectId: 'd9224e919473fd749ba8298879ce7569',
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
    chains: ['eip155:31'], // @TODO must be the current chainId from redux
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
    return 'UNSUPPORTED_NAMESPACE_KEY'
  }
  // Check if chains includes EIP155:31 OR EIP155:32
  if (
    !requiredNamespaces.eip155.chains?.includes(
      rskWalletConnectNamespace.eip155.chains[0],
    )
  ) {
    return 'UNSUPPORTED_CHAINS'
  }
  // Check if the methods that RSK allows are present
  if (
    !requiredNamespaces.eip155?.methods.every(
      method => rskWalletConnectNamespace.eip155.methods.indexOf(method) > -1,
    )
  ) {
    return 'UNSUPPORTED_METHODS'
  }
  // Check if the events that RSK allows are present
  if (
    !requiredNamespaces.eip155?.events.every(
      event => rskWalletConnectNamespace.eip155.events.indexOf(event) > -1,
    )
  ) {
    return 'UNSUPPORTED_EVENTS'
  }
}
