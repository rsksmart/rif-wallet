import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

export enum TransactionStatus {
  NONE = 'NONE',
  USER_CONFRIM = 'USER_CONFIRM',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface transactionInfo {
  status: TransactionStatus
  hash?: string
  network?: 'TRSK' | 'TBTC'
  token?: ITokenWithBalance
  amount?: number
  to?: string
}
