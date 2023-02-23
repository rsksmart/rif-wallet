import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
} from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import Resolver from '@rsksmart/rns-resolver.js'

import { ITokenWithoutLogo } from 'store/slices/balancesSlice/types'

import {
  RootTabsParamsList,
  rootTabsRouteNames,
  RootTabsScreenProps,
} from '../rootNavigator'

export enum homeStackRouteNames {
  Main = 'Main',
  Send = 'Send',
  RelayDeployScreen = 'RelayDeployScreen',
  Receive = 'Receive',
  Balances = 'Balances',
}

export type HomeStackParamsList = {
  [homeStackRouteNames.Main]: undefined
  [homeStackRouteNames.Send]:
    | {
        token?: string
        to?: string
        rnsResolver?: Resolver
        displayTo?: string
        contractAddress?: string
      }
    | undefined
  [homeStackRouteNames.Receive]: {
    token?: ITokenWithoutLogo
    networkId?: string
  }
  [homeStackRouteNames.Balances]: undefined
  [homeStackRouteNames.RelayDeployScreen]: undefined
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
