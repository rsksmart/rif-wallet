import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'

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
  EventsScreen = 'EventsScreen',
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
      }
  Receive: undefined
  ReceiveBitcoin: {
    network: BitcoinNetwork
  }
  Balances: undefined
  Activity: undefined
  ActivityDetails: undefined
  SignMessage: undefined
  SignTypedData: undefined
  TransactionReceived: undefined
  ManuallyDeployScreen: undefined
  CreateKeysUX: undefined
  ShowMnemonicScreen: undefined
  WalletConnect: undefined | { wcKey?: string }
  ScanQR: undefined
  ChangeLanguage: undefined
  ManagePin: undefined
  CreatePin: undefined
  RNSManager: undefined
  SearchDomain: undefined
  RequestDomain: undefined
  BuyDomain: undefined
  AliasBought: undefined
  RegisterDomain: { selectedDomain: string; years: number }
  Contacts: undefined
  Settings: undefined
  EventsScreen: undefined
  AccountsScreen: undefined
  SecurityConfigurationScreen: undefined
  ProfileCreateScreen: undefined
  ProfileDetailsScreen: undefined
  ChangePinScreen: undefined
  FeedbackScreen: undefined
}
