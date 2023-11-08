import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'
import { Request } from '@rsksmart/rif-wallet-core'

import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'

export interface ErrorWithMessage {
  message: string
}

export type RequestWithBitcoin = Request | SendBitcoinRequest

export interface Receiver {
  address: string
  displayAddress: string
}

export interface Contact extends Receiver {
  name: string
  isEditable?: boolean
}

export type Contacts = Record<string, Contact>

export type ContactWithAddressRequired = Partial<Omit<Contact, 'address'>> & {
  address: string
}

export type ActivityMainScreenProps =
  RootTabsScreenProps<rootTabsRouteNames.Activity>
