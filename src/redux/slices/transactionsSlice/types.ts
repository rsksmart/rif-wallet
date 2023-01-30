import { IActivityTransaction, IEvent } from 'src/subscriptions/types'
import { IApiTransaction } from 'lib/rifWalletServices/RIFWalletServicesTypes'

export interface TransactionsState {
  prev: string | null
  next: string | null
  transactions: IActivityTransaction[]
  events: IEvent[]
}

export interface TransactionExtras {
  symbol?: string
  finalAddress?: string
  enhancedAmount?: string
}

export type ApiTransactionWithExtras = IApiTransaction & TransactionExtras
export type ModifyTransactionAction = Partial<IApiTransaction> &
  Pick<IApiTransaction, 'hash'>
