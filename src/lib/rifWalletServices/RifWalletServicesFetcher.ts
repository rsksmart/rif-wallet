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
}

const RESULTS_LIMIT = 10

export class RifWalletServicesFetcher implements IRIFWalletServicesFetcher {
  uri = 'http://10.0.2.2:3000' // 'https://rif-wallet-services-dev.rifcomputing.net'

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
}
