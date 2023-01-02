import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
} from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import Resolver from '@rsksmart/rns-resolver.js'
import BitcoinNetwork from 'lib/bitcoin/BitcoinNetwork'
import {
  RootTabsParamsList,
  rootTabsRouteNames,
  RootTabsScreenProps,
} from '../rootNavigator'

export enum homeStackRouteNames {
  Main = 'Main',
  Send = 'Send',
  ManuallyDeployScreen = 'ManuallyDeployScreen',
  Receive = 'Receive',
  ReceiveBitcoin = 'ReceiveBitcoin',
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
  [homeStackRouteNames.Receive]: undefined
  [homeStackRouteNames.ReceiveBitcoin]: {
    network: BitcoinNetwork
  }
  [homeStackRouteNames.Balances]: undefined
  [homeStackRouteNames.ManuallyDeployScreen]: undefined
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
