import { NavigationProp, NavigatorScreenParams } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import Resolver from '@rsksmart/rns-resolver.js'
import { ContractTransaction } from 'ethers'

import BitcoinNetwork from 'lib/bitcoin/BitcoinNetwork'

import { ActivityMixedType } from 'screens/activity/types'
import { IProfileStore } from 'store/slices/profileSlice/types'
import { CreateKeysStackParamList } from '../createKeysNavigator'
import { RifWalletServicesFetcher } from 'src/lib/rifWalletServices/RifWalletServicesFetcher'

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NavigationProp<T>

export enum rootStackRouteNames {
  Home = 'Home',
  Send = 'Send',
  Receive = 'Receive',
  ReceiveBitcoin = 'ReceiveBitcoin',
  Balances = 'Balances',
  Activity = 'Activity',
  ActivityDetails = 'ActivityDetails',
  SignMessage = 'SignMessage',
  SignTypedData = 'SignTypedData',
  TransactionReceived = 'TransactionReceived',
  RelayDeployScreen = 'RelayDeployScreen',
  CreateKeysUX = 'CreateKeysUX',
  ShowMnemonicScreen = 'ShowMnemonicScreen',
  WalletConnect = 'WalletConnect',
  ScanQR = 'ScanQR',
  ChangeLanguage = 'ChangeLanguage',
  ManagePin = 'ManagePin',
  CreatePin = 'CreatePin',
  ChangePinScreen = 'ChangePinScreen',
  RNSManager = 'RNSManager',
  SearchDomain = 'SearchDomain',
  RequestDomain = 'RequestDomain',
  BuyDomain = 'BuyDomain',
  AliasBought = 'AliasBought',
  RegisterDomain = 'RegisterDomain',
  Contacts = 'Contacts',
  Settings = 'Settings',
  AccountsScreen = 'AccountsScreen',
  SecurityConfigurationScreen = 'SecurityConfigurationScreen',
  ProfileCreateScreen = 'ProfileCreateScreen',
  ProfileDetailsScreen = 'ProfileDetailsScreen',
  FeedbackScreen = 'FeedbackScreen',
}

export type RootStackParamList = {
  [rootStackRouteNames.Home]: undefined
  [rootStackRouteNames.Send]:
    | undefined
    | {
        token?: string
        to?: string
        rnsResolver?: Resolver
        displayTo?: string
        contractAddress?: string
      }
  [rootStackRouteNames.Receive]: undefined
  [rootStackRouteNames.ReceiveBitcoin]: {
    network: BitcoinNetwork
  }
  [rootStackRouteNames.Balances]: undefined
  [rootStackRouteNames.Activity]: {
    fetcher?: RifWalletServicesFetcher
  }
  [rootStackRouteNames.ActivityDetails]: ActivityMixedType
  [rootStackRouteNames.SignMessage]: undefined
  [rootStackRouteNames.SignTypedData]: undefined
  [rootStackRouteNames.TransactionReceived]: undefined
  [rootStackRouteNames.RelayDeployScreen]: undefined
  [rootStackRouteNames.CreateKeysUX]:
    | NavigatorScreenParams<CreateKeysStackParamList>
    | undefined
  [rootStackRouteNames.ShowMnemonicScreen]: undefined
  [rootStackRouteNames.WalletConnect]: undefined | { wcKey: string }
  [rootStackRouteNames.ScanQR]: undefined
  [rootStackRouteNames.ChangeLanguage]: undefined
  [rootStackRouteNames.ManagePin]: undefined
  [rootStackRouteNames.CreatePin]: undefined
  [rootStackRouteNames.RNSManager]: undefined
  [rootStackRouteNames.SearchDomain]: undefined
  [rootStackRouteNames.RequestDomain]: {
    alias: string
    duration: number
  }
  [rootStackRouteNames.BuyDomain]: {
    alias: string
    domainSecret: string
    duration: number
  }
  [rootStackRouteNames.AliasBought]: {
    alias: string
    tx: ContractTransaction
  }
  [rootStackRouteNames.Contacts]: undefined
  [rootStackRouteNames.Settings]: undefined
  [rootStackRouteNames.AccountsScreen]: undefined
  [rootStackRouteNames.SecurityConfigurationScreen]: undefined
  [rootStackRouteNames.ProfileCreateScreen]: {
    editProfile: boolean
    profile?: IProfileStore
  }
  [rootStackRouteNames.ProfileDetailsScreen]: undefined
  [rootStackRouteNames.ChangePinScreen]: undefined
  [rootStackRouteNames.FeedbackScreen]: undefined
}
