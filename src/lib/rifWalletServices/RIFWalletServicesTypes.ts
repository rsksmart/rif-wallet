export interface IApiTokens {
  address: string
  balance: string
  blockNumber: number
  isNative: false
  name: string
  symbol: string
  totalSupply: number
  type: string
  contract: string
  contractInterfaces: string[]
  contractMethods: string[]
  decimals: string
}

export interface TokensServerResponse {
  data: IApiTokens[]
}

export interface IToken {
  name: string
  logo: string
  symbol: string
  contractAddress: string
  decimals: number
}

export interface ITokenWithBalance extends IToken {
  balance: string
}

export interface IApiEvents {
  address: string
  blockHash: string
  blockNumber: number
  data: string
  event: string
  timestamp: number
  topics: string[]
  args: string[]
  transactionHash: string
  transactionIndex: number
  txStatus: string
}

export interface IEvent {
  blockNumber: number
  event: string
  timestamp: number
  topics: string[]
  args: string[]
  transactionHash: string
  txStatus: string
}

export interface EventsServerResponse {
  data: IApiEvents[]
}

export interface IApiTransaction {
  hash: string
  nonce: number
  blockHash: string
  blockNumber: number
  transactionIndex: number
  from: string
  to: string
  gas: number
  gasPrice: string
  value: string
  input: string
  timestamp: number
  receipt: any
  txType: string
  txId: string
  data?: string
}

export interface TransactionsServerResponse {
  data: IApiTransaction[]
  next: string | null | undefined
  prev: string | null | undefined
}

export interface VinType {
  txid: string
  vout: number
  sequence: any
  n: number
  addresses: string[]
  isAddress: boolean
  value: string
}

export interface VoutType {
  value: string
  n: number
  hex: string
  addresses: string[]
  isAddress: boolean
}

export interface BitcoinTransactionType {
  txid: string
  version: number
  vin: VinType[]
  vout: VoutType[]
  blockHash: string
  blockHeight: number
  confirmations: number
  blockTime: number
  value: string
  valueIn: string
  fees: string
  hex: string
  isBitcoin: boolean
}

export interface BitcoinTransactionContainerType {
  page: number
  totalPages: number
  itemsOnPage: number
  address: string
  balance: string
  totalReceived: string
  totalSent: string
  unconfirmedBalance: string
  unconfirmedTxs: number
  txs: number
  transactions: BitcoinTransactionType[]
  usedTokens: number
}
