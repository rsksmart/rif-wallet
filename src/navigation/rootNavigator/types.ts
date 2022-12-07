import { NavigationProp, NavigatorScreenParams } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import Resolver from '@rsksmart/rns-resolver.js'
import { ContractTransaction } from 'ethers'
import { ActivityMixedType } from 'src/screens/activity/types'
import { IProfileStore } from 'src/redux/slices/profileSlice/types'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import { CreateKeysStackParamList } from '../createKeysNavigator'

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>

export type RootStackNavigationProp = NavigationProp<RootStackParamList>

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
  ManuallyDeployScreen = 'ManuallyDeployScreen',
  CreateKeysUX = 'CreateKeysUX',
  ShowMnemonicScreen = 'ShowMnemonicScreen',
  WalletConnect = 'WalletConnect',
  ScanQR = 'ScanQR',
  ChangeLanguage = 'ChangeLanguage',
  ManagePin = 'ManagePin',
  CreatePin = 'CreatePin',
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
  ChangePinScreen = 'ChangePinScreen',
  FeedbackScreen = 'FeedbackScreen',
}

export type RootStackParamList = {
  Home: undefined
  Send:
    | undefined
    | {
        token?: string
        to?: string
        displayTo?: string
        contractAddress?: string
        rnsResolver?: Resolver
      }
  Receive: undefined
  ReceiveBitcoin: {
    network: BitcoinNetwork
  }
  Balances: undefined
  Activity: undefined
  ActivityDetails: ActivityMixedType
  SignMessage: undefined
  SignTypedData: undefined
  TransactionReceived: undefined
  ManuallyDeployScreen: undefined
  CreateKeysUX: NavigatorScreenParams<CreateKeysStackParamList> | undefined
  ShowMnemonicScreen: undefined
  WalletConnect: undefined | { wcKey?: string }
  ScanQR: undefined
  ChangeLanguage: undefined
  ManagePin: undefined
  CreatePin: undefined
  RNSManager: undefined
  SearchDomain: undefined
  RequestDomain: {
    alias: string
    duration: number
  }
  BuyDomain: {
    alias: string
    domainSecret: string
    duration: number
  }
  AliasBought: {
    alias: string
    tx: ContractTransaction
  }
  RegisterDomain: { selectedDomain: string; years: number }
  Contacts: undefined
  Settings: undefined
  AccountsScreen: undefined
  SecurityConfigurationScreen: undefined
  ProfileCreateScreen: {
    editProfile: boolean
    profile?: IProfileStore
  }
  ProfileDetailsScreen: undefined
  ChangePinScreen: undefined
  FeedbackScreen: undefined
}
