import { NavigatorScreenParams } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

import { ActivityMixedType } from 'screens/activity/types'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'

import { ContactStackParamsList } from '../contactsNavigator'
import { CreateKeysStackParamList } from '../createKeysNavigator'
import { HomeStackParamsList } from '../homeNavigator/types'
import { ProfileStackParamsList } from '../profileNavigator/types'

export type RootTabsScreenProps<T extends keyof RootTabsParamsList> =
  BottomTabScreenProps<RootTabsParamsList, T>

export enum rootTabsRouteNames {
  CreateKeysUX = 'CreateKeysUX',
  Home = 'Home',
  Activity = 'Activity',
  ActivityDetails = 'ActivityDetails',
  ScanQR = 'ScanQR',
  Contacts = 'Contacts',
  WalletConnect = 'WalletConnect',
  Settings = 'Settings',
  Profile = 'Profile',
  ChangePinScreen = 'ChangePinScreen',
  TransactionSummary = 'Transaction Summary',
}

export type RootTabsParamsList = {
  [rootTabsRouteNames.TransactionSummary]: TransactionSummaryScreenProps
  [rootTabsRouteNames.CreateKeysUX]:
    | NavigatorScreenParams<CreateKeysStackParamList>
    | undefined
  [rootTabsRouteNames.Home]:
    | NavigatorScreenParams<HomeStackParamsList>
    | undefined
  [rootTabsRouteNames.Activity]: undefined
  [rootTabsRouteNames.ActivityDetails]: ActivityMixedType
  [rootTabsRouteNames.ScanQR]: undefined
  [rootTabsRouteNames.Contacts]:
    | NavigatorScreenParams<ContactStackParamsList>
    | undefined
  [rootTabsRouteNames.WalletConnect]: undefined | { wcKey: string }
  [rootTabsRouteNames.Settings]: undefined
  [rootTabsRouteNames.Profile]:
    | NavigatorScreenParams<ProfileStackParamsList>
    | undefined
}
