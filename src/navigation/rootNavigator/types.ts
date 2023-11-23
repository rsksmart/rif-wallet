import { NavigatorScreenParams } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'

import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { ActivityMixedType } from 'store/slices/transactionsSlice'

import { ContactStackParamsList } from '../contactsNavigator'
import { CreateKeysStackParamList } from '../createKeysNavigator'
import { HomeStackParamsList } from '../homeNavigator/types'
import { ProfileStackParamsList } from '../profileNavigator/types'
import { SettingsStackParamsList } from '../settingsNavigator/types'

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
  TransactionSummary = 'TransactionSummary',
  InitialPinScreen = 'InitialPinScreen',
  OfflineScreen = 'OfflineScreen',
  ConfirmNewMasterKey = 'ConfirmNewMasterKey',
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
  [rootTabsRouteNames.WalletConnect]: undefined | { data: string }
  [rootTabsRouteNames.Settings]:
    | undefined
    | NavigatorScreenParams<SettingsStackParamsList>
  [rootTabsRouteNames.Profile]:
    | NavigatorScreenParams<ProfileStackParamsList>
    | undefined
  [rootTabsRouteNames.OfflineScreen]: undefined
  [rootTabsRouteNames.ConfirmNewMasterKey]: {
    mnemonic: string
  }
}
