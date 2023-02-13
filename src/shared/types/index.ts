import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'
import { Request } from '@rsksmart/rif-wallet-core'

export interface ErrorWithMessage {
  message: string
}

export type RequestWithBitcoin = Request | SendBitcoinRequest
