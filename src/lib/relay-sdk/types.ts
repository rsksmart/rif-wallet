import { Signer } from 'ethers'

export type Address = string
export type IntString = string
export type PrefixedHexString = string

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

export interface RelayData {
  gasPrice: IntString
  domainSeparator: PrefixedHexString
  relayWorker: Address
  callForwarder: Address
  callVerifier: Address
}

export interface ForwardRequest {
  relayHub: Address
  from: Address
  to: Address
  tokenContract: Address
  value: IntString
  gas: IntString
  nonce: IntString
  tokenAmount: IntString
  tokenGas: IntString
  data: PrefixedHexString
}

export interface RelayRequest {
  request: ForwardRequest
  relayData: RelayData
}

export interface DeployRequestStruct {
  relayHub: Address
  from: Address
  to: Address
  tokenContract: Address
  recoverer: Address
  value: IntString
  nonce: IntString
  tokenAmount: IntString
  tokenGas: IntString
  index: IntString
  data: PrefixedHexString
}

export interface DeployRequest {
  request: DeployRequestStruct
  relayData: RelayData
}

export const EIP712DomainType = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

export interface RelayPayment {
  tokenContract: string
  tokenAmount: number | string
}

export interface SdkConfig extends RifRelayConfig {
  relayWorkerAddress: Address
  relayHubAddress: Address
}

export interface RifRelayConfig {
  relayVerifierAddress: Address
  deployVerifierAddress: Address
  relayServer: string
}
