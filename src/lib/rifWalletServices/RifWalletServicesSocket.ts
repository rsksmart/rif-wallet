import EventEmitter from 'events'
import { io } from 'socket.io-client'
import { enhanceTransactionInput } from '../../screens/activity/ActivityScreen'
import { Cache } from '../../storage/cache/Cache'
import { IActivityTransaction } from '../../subscriptions/types'
import { IAbiEnhancer } from '../abiEnhancer/AbiEnhancer'
import { RIFWallet } from '../core'
import { IRIFWalletServicesFetcher } from './RifWalletServicesFetcher'
import { IApiTransaction, ITokenWithBalance } from './RIFWalletServicesTypes'

export interface IServiceChangeEvent {
  type: string
  payload: any
}

export interface IServiceInitEvent {
  transactions: IActivityTransaction[]
  balances: ITokenWithBalance[]
}

export interface IRifWalletServicesSocket extends EventEmitter {
  connect: (wallet: RIFWallet) => Promise<void>

  disconnect(): void
  isConnected(): boolean

  on(event: 'init', listener: (result: IServiceInitEvent) => void): this
  on(event: 'change', listener: (result: IServiceChangeEvent) => void): this
}

export class RifWalletServicesSocket
  extends EventEmitter
  implements IRifWalletServicesSocket
{
  private rifWalletServicesUrl: string
  private fetcher: IRIFWalletServicesFetcher
  private abiEnhancer: IAbiEnhancer
  private socket: any

  constructor(
    rifWalletServicesUrl: string,
    fetcher: IRIFWalletServicesFetcher,
    abiEnhancer: IAbiEnhancer,
  ) {
    super()

    this.abiEnhancer = abiEnhancer
    this.fetcher = fetcher
    this.rifWalletServicesUrl = rifWalletServicesUrl
  }

  private async init(wallet: RIFWallet) {
    const cache = new Cache('txs')
    const fetchedTransactions = await this.fetcher.fetchTransactionsByAddress(
      wallet.smartWalletAddress,
    )

    const activityTransactions = await Promise.all<IActivityTransaction[]>(
      fetchedTransactions.data.map(async (tx: IApiTransaction) => {
        if (cache.has(tx.hash)) {
          console.log('Getting from cache', cache.get(tx.hash))
          return {
            originTransaction: tx,
            enhancedTransaction: cache.get(tx.hash),
          }
        }
        const enhancedTransaction = await enhanceTransactionInput(
          tx,
          wallet,
          this.abiEnhancer,
        )
        cache.set(tx.hash, enhancedTransaction)
        return {
          originTransaction: tx,
          enhancedTransaction,
        } as any
      }),
    )

    const fetchedTokens = (await this.fetcher.fetchTokensByAddress(
      wallet.smartWalletAddress,
    )) as ITokenWithBalance[]

    this.emit('init', {
      transactions: activityTransactions,
      balances: fetchedTokens,
    })
  }

  async connect(wallet: RIFWallet) {
    try {
      await this.init(wallet)

      const socket = io(this.rifWalletServicesUrl, {
        path: '/ws',
        forceNew: true,
        reconnectionAttempts: 3,
        timeout: 2000,
        autoConnect: true,
        transports: ['websocket'], // you need to explicitly tell it to use websocket
      })

      socket.on('connect', () => {
        socket.on('change', (event: IServiceChangeEvent) => {
          this.emit('change', event)
        })

        socket.emit('subscribe', { address: wallet.smartWalletAddress })
      })

      this.socket = socket
    } catch (error) {
      console.error('socket error', error)
      throw new Error(error)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  isConnected() {
    if (!this.socket) {
      return false
    }

    return this.socket.connected
  }
}
