import {
  BitcoinTransactionContainerType,
  ITokenWithBalance,
  TransactionsServerResponse,
} from './RIFWalletServicesTypes'
import * as Keychain from 'react-native-keychain'
import axios, { AxiosInstance } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { UnspentTransactionType } from '../bitcoin/types'
import { defaultChainId } from 'core/config'

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
  axiosInstance: AxiosInstance
  accessToken = ''
  refreshToken = ''

  constructor(
    axiosInstance: AxiosInstance,
    accessToken: string,
    refreshToken: string,
  ) {
    this.axiosInstance = axiosInstance
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.axiosInstance.interceptors.request.use(
      config => {
        if (!config.headers?.Authorization) {
          config.headers!.Authorization = `DIDAuth ${this.getAccessToken()}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      },
    )

    this.axiosInstance.interceptors.request.use(
      config => {
        config.params = { ...config.params, chainId: defaultChainId }
        return config
      },
      error => {
        return Promise.reject(error)
      },
    )

    const refreshAuthLogic = async (failedRequest: any) => {
      const data = {
        refreshToken: this.getRefreshToken(),
      }
      const options = {
        method: 'POST',
        data,
        url: `${this.axiosInstance.getUri()}/refresh-token`,
      }

      try {
        const {
          data: {
            accessToken: currentAccessToken,
            refreshToken: currentRefreshToken,
          },
        } = await axios(options)
        failedRequest.response.config.headers.Authorization =
          'DIDAuth ' + currentAccessToken

        await Keychain.setInternetCredentials(
          'jwt',
          'token',
          JSON.stringify({
            accessToken: currentAccessToken,
            refreshToken: currentRefreshToken,
          }),
        )
        this.accessToken = currentAccessToken
        this.refreshToken = currentRefreshToken
        return await Promise.resolve()
      } catch (e) {}
    }

    createAuthRefreshInterceptor(this.axiosInstance, refreshAuthLogic, {
      shouldRefresh: error => {
        const message = error.response?.data as string
        return message.includes('expired')
      },
    })
  }

  private getAccessToken = () => {
    return this.accessToken
  }

  private getRefreshToken = () => {
    return this.refreshToken
  }

  protected async fetchAvailableTokens() {
    return this.axiosInstance.get('/tokens')
  }

  fetchTransactionsByAddress = (
    smartAddress: string,
    prev?: string | null,
    next?: string | null,
    blockNumber?: string | null,
  ) => {
    let transactionsUrl = `/address/${smartAddress}/transactions?limit=${RESULTS_LIMIT}`

    if (prev) {
      transactionsUrl = `${transactionsUrl}&prev=${prev}`
    } else if (next) {
      transactionsUrl = `${transactionsUrl}&next=${next}`
    }

    if (blockNumber !== null) {
      transactionsUrl = `${transactionsUrl}&blockNumber=${blockNumber}`
    }

    return this.axiosInstance
      .get<TransactionsServerResponse>(transactionsUrl)
      .then(response => response.data)
  }

  fetchEventsByAddress = (smartAddress: string) =>
    this.axiosInstance.get(`/address/${smartAddress}/events`)

  fetchTokensByAddress = (address: string): Promise<ITokenWithBalance[]> =>
    this.axiosInstance
      .get<ITokenWithBalance[]>(`/address/${address.toLowerCase()}/tokens`)
      .then(response => response.data)

  fetchDapps = (): Promise<IRegisteredDappsGroup[]> =>
    this.axiosInstance
      .get<IRegisteredDappsGroup[]>('/dapps')
      .then(response => response.data)

  fetchXpubBalance = (xpub: string): Promise<IXPubBalanceData> =>
    this.axiosInstance
      .get<IXPubBalanceData>(`/bitcoin/getXpubBalance/${xpub}`)
      .then(response => response.data)
  fetchUtxos = (xpub: string): Promise<Array<UnspentTransactionType>> =>
    this.axiosInstance
      .get<Array<UnspentTransactionType>>(`/bitcoin/getXpubUtxos/${xpub}`)
      .then(res => res.data)

  sendTransactionHexData = (hexdata: string): Promise<any> =>
    this.axiosInstance
      .get(`/bitcoin/sendTransaction/${hexdata}`)
      .then(res => res.data)

  fetchXpubNextUnusedIndex = (
    xpub: string,
    changeIndex = 0,
    knownLastUsedIndex = 0,
  ): Promise<number> =>
    this.axiosInstance
      .get(
        `/bitcoin/getNextUnusedIndex/${xpub}?changeIndex=${changeIndex}&knownLastUsedIndex=${knownLastUsedIndex}`,
      )
      .then(response => response.data)
      .then(json => json.index)

  fetchXpubTransactions = (
    xpub: string,
    pageSize: number | undefined = undefined,
    pageNumber = 1,
  ): Promise<BitcoinTransactionContainerType> =>
    this.axiosInstance
      .get<BitcoinTransactionContainerType>(
        `/bitcoin/getXpubTransactions/${xpub}?pageSize=${pageSize}&page=${pageNumber}`,
      )
      .then(response => response.data)
}
