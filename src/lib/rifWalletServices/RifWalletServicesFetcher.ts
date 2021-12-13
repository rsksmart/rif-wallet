import {
  ITokenWithBalance,
  TransactionsServerResponse,
} from './RIFWalletServicesTypes'

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
}
