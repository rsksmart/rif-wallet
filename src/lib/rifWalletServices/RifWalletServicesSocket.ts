import EventEmitter from 'events'
import { io, Socket } from 'socket.io-client'

import { enhanceTransactionInput } from 'screens/activity/ActivityScreen'
import { MMKVStorage } from 'src/storage/MMKVStorage'
import { IActivityTransaction } from 'src/subscriptions/types'
import { IAbiEnhancer } from '../abiEnhancer/AbiEnhancer'
import { RIFWallet } from '../core'
import { RifWalletServicesFetcher } from './RifWalletServicesFetcher'
import { IApiTransaction, ITokenWithBalance } from './RIFWalletServicesTypes'
import { filterEnhancedTransactions } from 'src/subscriptions/utils'

export interface IServiceChangeEvent {
  type: string
  payload: unknown // TODO: what is the payload?
}

export interface IServiceInitEvent {
  transactions: IActivityTransaction[]
  balances: ITokenWithBalance[]
}

export interface IRifWalletServicesSocket extends EventEmitter {
  connect: (
    wallet: RIFWallet,
    encryptionKey: string,
    fetcher: RifWalletServicesFetcher,
  ) => Promise<void>

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
  private abiEnhancer: IAbiEnhancer
  private socket: Socket | undefined

  constructor(rifWalletServicesUrl: string, abiEnhancer: IAbiEnhancer) {
    super()

    this.abiEnhancer = abiEnhancer
    this.rifWalletServicesUrl = rifWalletServicesUrl
  }

  private async init(wallet: RIFWallet, encryptionKey: string, fetcher: RifWalletServicesFetcher) {
    const cache = new MMKVStorage('txs', encryptionKey)
    const blockNumber = cache.get('blockNumber') || '0'
    const catchedTxs = cache.get('cachedTxs') || []
    const fetchedTransactions = await fetcher.fetchTransactionsByAddress(
      wallet.smartWalletAddress,
      null,
      null,
      blockNumber,
    )

    let lastBlockNumber = blockNumber
    const activityTransactions = await Promise.all(
      // TODO: why Promise.all?
      fetchedTransactions.data.map(async (tx: IApiTransaction) => {
        if (parseInt(blockNumber, 10) < tx.blockNumber) {
          lastBlockNumber = tx.blockNumber
        }
        if (cache.has(tx.hash)) {
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
        if (enhancedTransaction) {
          cache.set(tx.hash, enhancedTransaction)
          return {
            originTransaction: tx,
            enhancedTransaction,
          }
        } else {
          return {
            originTransaction: tx,
            enhancedTransaction: undefined,
          }
        }
      }),
    )
    const transactions = catchedTxs
      .concat(activityTransactions)
      .filter(filterEnhancedTransactions)
    cache.set('cachedTxs', transactions)
    cache.set('blockNumber', lastBlockNumber.toString())
    const fetchedTokens = await fetcher.fetchTokensByAddress(
      wallet.smartWalletAddress,
    )

    this.emit('init', {
      transactions: transactions,
      balances: fetchedTokens,
    })
  }

  async connect(
    wallet: RIFWallet,
    encriptionKey: string,
    fetcher: RifWalletServicesFetcher
  ) {
    try {
      await this.init(wallet, encriptionKey, fetcher)

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
      if (error instanceof Error) {
        throw new Error(error.toString())
      }
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
