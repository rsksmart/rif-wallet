import { Request } from 'lib/core'
import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'

export interface ErrorWithMessage {
  message: string
}

export type RequestWithBitcoin = Request | SendBitcoinRequest
