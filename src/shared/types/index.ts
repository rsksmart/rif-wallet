import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'
import { Request } from '@rsksmart/rif-wallet-core'
import { CompositeScreenProps } from '@react-navigation/native'

import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'

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

export type ActivityMainScreenProps = CompositeScreenProps<
  RootTabsScreenProps<rootTabsRouteNames.Activity>,
  HomeStackScreenProps<homeStackRouteNames.Main>
>
