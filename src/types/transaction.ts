export interface TransactionPartial {
  to: string
  from: string
  value: number
  data?: string
  gasLimit?: number | string // string for easier editing below
  gasPrice?: number | string
}
