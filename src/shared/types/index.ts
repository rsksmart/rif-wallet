import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'
import { Request } from '@rsksmart/rif-wallet-core'

export interface ErrorWithMessage {
  message: string
}

export type RequestWithBitcoin = Request | SendBitcoinRequest

export interface Contact {
  name: string
  address: string
  displayAddress: string
  isEditable?: boolean
}

export type ContactWithAddressRequired = Partial<Omit<Contact, 'address'>> & {
  address: string
}
