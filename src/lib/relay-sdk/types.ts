import { BigNumber } from 'ethers'

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
  { name: 'validUntilTime', type: 'uint256' },
  { name: 'index', type: 'uint256' },
  { name: 'data', type: 'bytes' },
]

export const RelayDataType = [
  { name: 'gasPrice', type: 'uint256' },
  { name: 'feesReceiver', type: 'address' },
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
  { name: 'validUntilTime', type: 'uint256' },
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

export interface RelayData {
  gasPrice: IntString
  feesReceiver: Address
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
  validUntilTime: IntString
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
  validUntilTime: IntString
}

export interface DeployRequest {
  request: DeployRequestStruct
  relayData: RelayData
}

export interface RelayPayment {
  tokenContract: Address
  tokenAmount: BigNumber
}

export interface RifRelayConfig {
  relayVerifierAddress: Address
  deployVerifierAddress: Address
  relayServer: string
}

/**
 * The response from the server when calling /getaddr
 */
export interface ServerConfig {
  relayWorkerAddress: Address
  relayManagerAddress: Address
  relayHubAddress: Address
  minGasPrice: string
  chainId: string
  networkId: string
  ready: boolean
  version: string
  feesReceiver: Address
}

export interface ServerEstimate {
  estimation: IntString
  exchangeRate: IntString
  gasPrice: IntString
  requiredNativeAmount: IntString
  requiredTokenAmount: IntString
}
