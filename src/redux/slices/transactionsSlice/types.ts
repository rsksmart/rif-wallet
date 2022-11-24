import { IActivityTransaction } from 'src/subscriptions/types'

export interface ITransactionsState {
  prev: string | undefined
  next: string | undefined
  transactions: IActivityTransaction[]
}
