import { Signer } from "ethers"

export const DeployRequestDataType = [
  { name: 'relayHub', type: 'address' },
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'tokenContract', type: 'address' },
  { name: 'recoverer', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'tokenAmount', type: 'uint256' },
  { name: 'tokenGas', type: 'uint256' },
  { name: 'index', type: 'uint256' },
  { name: 'data', type: 'bytes' },
]

export const RelayDataType = [
  { name: 'gasPrice', type: 'uint256' },
  { name: 'domainSeparator', type: 'bytes32' },
  { name: 'relayWorker', type: 'address' },
  { name: 'callForwarder', type: 'address' },
  { name: 'callVerifier', type: 'address' },
]

export const ForwardRequestType = [
  { name: 'relayHub', type: 'address' },
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'tokenContract', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'tokenAmount', type: 'uint256' },
  { name: 'tokenGas', type: 'uint256' },
  { name: 'data', type: 'bytes' },
]

export const DeployRequestType = [
  ...DeployRequestDataType,
  { name: 'relayData', type: 'RelayData' },
]

export const RelayRequestType = [
  ...ForwardRequestType,
  { name: 'relayData', type: 'RelayData' },
]

// use these values in registerDomainSeparator
export const DomainSeparatorType = {
  prefix: 'string name,string version',
  name: 'RSK Enveloping Transaction',
  version: '2',
}

export interface SDKConfiguration {
  chainId?: number
  signer?: Signer
  smartWalletFactoryContractAddress?: string
  smartWalletContractAddress?: string
  relayHubContractAddress?: string
  relayWorkerAddress: string
  relayVerifierAddress: string
  deployVerifierAddress: string
}
