import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'

import { Request } from 'lib/core'

export interface ErrorWithMessage {
  message: string
}

export type RequestWithBitcoin = Request | SendBitcoinRequest
