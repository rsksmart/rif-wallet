import { IActivityTransaction, IEvent } from 'src/subscriptions/types'

export interface ITransactionsState {
  prev: string | null | undefined
  next: string | null | undefined
  transactions: IActivityTransaction[]
  events: IEvent[]
}
