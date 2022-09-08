import EventEmitter from 'events'
import { io } from 'socket.io-client'
import { db } from '../../core/setup'
import { enhanceTransactionInput } from '../../screens/activity/ActivityScreen'
import { TransactionSchema } from '../../storage/db/RealmDb'
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
    await db.init(TransactionSchema)
    const init = new Date().getTime()
    const fetchedTransactions = await this.fetcher.fetchTransactionsByAddress(
      wallet.smartWalletAddress,
    )
    const end1 = new Date().getTime()
    console.log('Fetch transactions', new Date().getTime() - init)
    const activityTransactions = await Promise.all<IActivityTransaction[]>(
      fetchedTransactions.data.map(async (tx: IApiTransaction) => {
        if (db.has(TransactionSchema.name, tx.hash)) {
          return {
            originTransaction: tx,
            enhancedTransaction: db.get(TransactionSchema.name, tx.hash).value,
          } as any
        }

        const enhancedTransaction = await enhanceTransactionInput(
          tx,
          wallet,
          this.abiEnhancer,
        )
        db.store(TransactionSchema.name, tx.hash, enhancedTransaction)
        return {
          originTransaction: tx,
          enhancedTransaction,
        } as any
      }),
    )
    const end3 = new Date().getTime()
    console.log('Enhance Transactions', end3 - end1)
    const fetchedTokens = (await this.fetcher.fetchTokensByAddress(
      wallet.smartWalletAddress,
    )) as ITokenWithBalance[]
    const end4 = new Date().getTime()
    console.log('Fetch Token Events', end4 - end3)
    this.emit('init', {
      transactions: activityTransactions,
      balances: fetchedTokens,
    })
    const end5 = new Date().getTime()
    console.log('Emmitting', end5 - end4)
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
