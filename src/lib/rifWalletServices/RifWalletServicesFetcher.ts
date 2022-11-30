import {
  BitcoinTransactionContainerType,
  ITokenWithBalance,
  TransactionsServerResponse,
} from './RIFWalletServicesTypes'
import { UnspentTransactionType } from '../bitcoin/types'

export interface IRIFWalletServicesFetcher {
  fetchTokensByAddress(address: string): Promise<ITokenWithBalance[]>
  fetchTransactionsByAddress(
    address: string,
    prev?: string | null,
    next?: string | null,
  ): Promise<TransactionsServerResponse>
  fetchDapps(): Promise<IRegisteredDappsGroup[]>
}

export interface IRegisteredDapp {
  title: string
  url: string
  allowedNetworks: number[]
}

export interface IRegisteredDappsGroup {
  groupName: string
  dapps: IRegisteredDapp[]
}

export interface IXPubBalanceData {
  address: string
  balance: string
  totalReceived: string
  totalSent: string
  txs: number
  btc: number
}

export interface ISendTransactionJsonReturnData {
  error?: string
  result?: string
}

const RESULTS_LIMIT = 10

export class RifWalletServicesFetcher implements IRIFWalletServicesFetcher {
  uri: string

  constructor(uri: string) {
    this.uri = uri
  }

  protected async fetchAvailableTokens() {
    return fetch(`${this.uri}/tokens`).then(response => response.json())
  }

  fetchTransactionsByAddress = (
    smartAddress: string,
    prev?: string | null,
    next?: string | null,
  ) => {
    let transactionsUrl = `${this.uri}/address/${smartAddress}/transactions?limit=${RESULTS_LIMIT}`

    if (prev) {
      transactionsUrl = `${transactionsUrl}&prev=${prev}`
    } else if (next) {
      transactionsUrl = `${transactionsUrl}&next=${next}`
    }

    return fetch(transactionsUrl).then(response => response.json())
  }

  fetchEventsByAddress = (smartAddress: string) =>
    fetch(`${this.uri}/address/${smartAddress}/events`).then(response =>
      response.json(),
    )

  fetchTokensByAddress = (address: string): Promise<ITokenWithBalance[]> =>
    fetch(`${this.uri}/address/${address.toLowerCase()}/tokens`).then(
      response => response.json(),
    )

  fetchDapps = (): Promise<IRegisteredDappsGroup[]> =>
    fetch(`${this.uri}/dapps`).then(response => response.json())

  fetchXpubBalance = (xpub: string): Promise<IXPubBalanceData> =>
    fetch(`${this.uri}/bitcoin/getXpubBalance/${xpub}`).then(response =>
      response.json(),
    )
  fetchUtxos = (xpub: string): Promise<Array<UnspentTransactionType>> =>
    fetch(`${this.uri}/bitcoin/getXpubUtxos/${xpub}`).then(res => res.json())

  sendTransactionHexData = (
    hexdata: string,
  ): Promise<ISendTransactionJsonReturnData> =>
    fetch(`${this.uri}/bitcoin/sendTransaction/${hexdata}`).then(res =>
      res.json(),
    )

  fetchXpubNextUnusedIndex = (
    xpub: string,
    changeIndex = 0,
    knownLastUsedIndex = 0,
  ): Promise<number> =>
    fetch(
      `${this.uri}/bitcoin/getNextUnusedIndex/${xpub}?changeIndex=${changeIndex}&knownLastUsedIndex=${knownLastUsedIndex}`,
    )
      .then(response => response.json())
      .then(json => json.index)

  fetchXpubTransactions = (
    xpub: string,
    pageSize: number | undefined = undefined,
    pageNumber = 1,
  ): Promise<BitcoinTransactionContainerType> =>
    fetch(
      `${this.uri}/bitcoin/getXpubTransactions/${xpub}?pageSize=${pageSize}&page=${pageNumber}`,
    ).then(response => response.json())
}
