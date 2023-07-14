import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
} from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'
import { ContactWithAddressRequired } from 'src/shared/types'

import {
  RootTabsParamsList,
  rootTabsRouteNames,
  RootTabsScreenProps,
} from '../rootNavigator'
import { contactsStackRouteNames } from '../contactsNavigator'

export enum homeStackRouteNames {
  Main = 'Main',
  Send = 'Send',
  Receive = 'Receive',
  Balances = 'Balances',
}

export type HomeStackParamsList = {
  [homeStackRouteNames.Main]: undefined
  [homeStackRouteNames.Send]: {
    backScreen?: rootTabsRouteNames.Home | contactsStackRouteNames.ContactsList
    token?: string
    contact?: ContactWithAddressRequired
    contractAddress?: string
  }
  [homeStackRouteNames.Receive]: {
    token?: ITokenWithoutLogo
    networkId?: string
  }
  [homeStackRouteNames.Balances]: undefined
}

export type HomeStackNavigationProp = CompositeNavigationProp<
  NavigationProp<HomeStackParamsList>,
  NavigationProp<RootTabsParamsList>
>

export type HomeStackScreenProps<T extends keyof HomeStackParamsList> =
  CompositeScreenProps<
    StackScreenProps<HomeStackParamsList, T>,
    RootTabsScreenProps<rootTabsRouteNames.Home>
  >
