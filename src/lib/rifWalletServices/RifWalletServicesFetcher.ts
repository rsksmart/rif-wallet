import { ITokenWithBalance } from './RIFWalletServicesTypes'

export class RifWalletServicesFetcher {
  uri = 'http://10.0.2.2:3000'

  protected async fetchAvailableTokens() {
    const response = await fetch(`${this.uri}/tokens`)
    return await response.json()
  }

  protected async fetchTransactionsByAddress(smartAddress: string) {
    const response = await fetch(
      `${this.uri}/address/${smartAddress}/transactions`,
    )
    return await response.json()
  }
  protected async fetchEventsByAddress(smartAddress: string) {
    const response = await fetch(`${this.uri}/address/${smartAddress}/events`)
    return await response.json()
  }
  public async fetchTokensByAddress(
    smartAddress: string,
  ): Promise<ITokenWithBalance[]> {
    const response = await fetch(`${this.uri}/address/${smartAddress}/tokens`)
    return (await response.json()) as ITokenWithBalance[]
  }
}
