export interface TransactionInformation {
  status: 'NONE' | 'USER_CONFIRM' | 'PENDING' | 'SUCCESS' | 'FAILED'
  to?: string
  value?: string
  symbol?: string
  hash?: string
  feeSymbol?: string
}
