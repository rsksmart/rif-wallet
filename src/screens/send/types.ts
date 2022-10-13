export enum TransactionStatus {
  NONE = 'NONE',
  USER_CONFRIM = 'USER_CONFIRM',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface transactionInfo {
  hash?: string
  network?: 'TRSK' | 'TBTC'
  status: TransactionStatus
}
