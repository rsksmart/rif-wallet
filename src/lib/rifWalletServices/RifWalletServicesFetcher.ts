import { ITokenWithBalance } from './RIFWalletServicesTypes'

export class RifWalletServicesFetcher {
  uri = 'https://rif-wallet-services-dev.rifcomputing.net'

  protected async fetchAvailableTokens() {
    return fetch(`${this.uri}/tokens`).then(response => response.json())
  }

  fetchTransactionsByAddress = (smartAddress: string) =>
    fetch(`${this.uri}/address/${smartAddress}/transactions`).then(response =>
      response.json(),
    )

  fetchEventsByAddress = (smartAddress: string) =>
    fetch(`${this.uri}/address/${smartAddress}/events`).then(response =>
      response.json(),
    )

  fetchTokensByAddress = (address: string): Promise<ITokenWithBalance[]> =>
    fetch(`${this.uri}/address/${address.toLowerCase()}/tokens`).then(
      response => response.json(),
    )
}
