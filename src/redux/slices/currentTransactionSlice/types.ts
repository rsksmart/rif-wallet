import { TransactionStatus } from 'screens/transactionSummary/types'

export interface TransactionInformation {
  status: TransactionStatus
  to?: string
  value?: string
  symbol?: string
  hash?: string
  feeSymbol?: string
}
