import { IActivityTransaction, IEvent } from 'src/subscriptions/types'

export interface ITransactionsState {
  prev: string | null
  next: string | null
  transactions: IActivityTransaction[]
  events: IEvent[]
}
