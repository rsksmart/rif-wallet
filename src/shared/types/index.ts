import {
  BitcoinNetwork,
  SendBitcoinRequest,
} from '@rsksmart/rif-wallet-bitcoin'

import { Request } from 'lib/eoaWallet'

import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

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

export type Contacts = Record<string, Contact>

export type ContactWithAddressRequired = Partial<Omit<Contact, 'address'>> & {
  address: string
}

export type ActivityMainScreenProps =
  RootTabsScreenProps<rootTabsRouteNames.Activity>

export type TokenOrBitcoinNetwork = ITokenWithoutLogo | BitcoinNetwork
