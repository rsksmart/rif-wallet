import {
  BitcoinTransactionContainerType,
  ITokenWithBalance,
  TransactionsServerResponse,
} from './RIFWalletServicesTypes'
import { UnspentTransactionType } from '../bitcoin/BIP84Payment'
import { Axios } from 'axios'

export interface IRIFWalletServicesFetcher {
  fetchTokensByAddress(address: string): Promise<ITokenWithBalance[]>
  fetchTransactionsByAddress(
    address: string,
    prev?: string | null,
    next?: string | null,
    blockNumber?: string | null,
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
  axios: Axios

  constructor(uri: string, axios: Axios) {
    this.uri = uri
    this.axios = axios
  }

  protected async fetchAvailableTokens() {
    return this.axios.get(`${this.uri}/tokens`)
  }

  fetchTransactionsByAddress = (
    smartAddress: string,
    prev?: string | null,
    next?: string | null,
    blockNumber?: string | null,
  ) => {
    let transactionsUrl = `${this.uri}/address/${smartAddress}/transactions?limit=${RESULTS_LIMIT}`

    if (prev) {
      transactionsUrl = `${transactionsUrl}&prev=${prev}`
    } else if (next) {
      transactionsUrl = `${transactionsUrl}&next=${next}`
    }

    if (blockNumber !== null) {
      transactionsUrl = `${transactionsUrl}&blockNumber=${blockNumber}`
    }

    return this.axios.get<TransactionsServerResponse>(transactionsUrl).then(response => response.data)
  }

  fetchEventsByAddress = (smartAddress: string) =>
    this.axios.get(`${this.uri}/address/${smartAddress}/events`)

  fetchTokensByAddress = (address: string): Promise<ITokenWithBalance[]> =>
    this.axios.get<ITokenWithBalance[]>(`${this.uri}/address/${address.toLowerCase()}/tokens`).then(response => response.data)

  fetchDapps = (): Promise<IRegisteredDappsGroup[]> =>
    this.axios.get<IRegisteredDappsGroup[]>(`${this.uri}/dapps`).then(response => response.data)

  fetchXpubBalance = (xpub: string): Promise<IXPubBalanceData> =>
    this.axios.get<IXPubBalanceData>(`${this.uri}/bitcoin/getXpubBalance/${xpub}`).then(response =>
      response.data
    )
  fetchUtxos = (xpub: string): Promise<Array<UnspentTransactionType>> =>
    this.axios.get<Array<UnspentTransactionType>>(`${this.uri}/bitcoin/getXpubUtxos/${xpub}`).then(res =>
      res.data,
    )

  sendTransactionHexData = (hexdata: string): Promise<any> =>
    this.axios.get(`${this.uri}/bitcoin/sendTransaction/${hexdata}`).then(res =>
      res.data
    )

  fetchXpubNextUnusedIndex = (
    xpub: string,
    changeIndex = 0,
    knownLastUsedIndex = 0,
  ): Promise<number> =>
    this.axios.get(
      `${this.uri}/bitcoin/getNextUnusedIndex/${xpub}?changeIndex=${changeIndex}&knownLastUsedIndex=${knownLastUsedIndex}`,
    )
      .then(response => response.data)
      .then(json => json.index)

  fetchXpubTransactions = (
    xpub: string,
    pageSize: number | undefined = undefined,
    pageNumber = 1,
  ): Promise<BitcoinTransactionContainerType> =>
    this.axios.get<BitcoinTransactionContainerType>(
      `${this.uri}/bitcoin/getXpubTransactions/${xpub}?pageSize=${pageSize}&page=${pageNumber}`,
    ).then(response => response.data)
}
