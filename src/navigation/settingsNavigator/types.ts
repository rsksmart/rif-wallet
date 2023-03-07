import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'

export enum settingsStackRouteNames {
  SettingsScreen = 'SettingsScreen',
  ChangeLanguage = 'ChangeLanguage',
  AccountsScreen = 'AccountsScreen',
  SecurityConfigurationScreen = 'SecurityConfigurationScreen',
  FeedbackScreen = 'FeedbackScreen',
  ShowMnemonicScreen = 'ShowMnemonicScreen',
  ChangePinScreen = 'ChangePinScreen',
  ExampleScreen = 'ExampleScreen',
}

export type SettingsStackParamsList = {
  [settingsStackRouteNames.SettingsScreen]: undefined
  [settingsStackRouteNames.ChangeLanguage]: undefined
  [settingsStackRouteNames.AccountsScreen]: undefined
  [settingsStackRouteNames.SecurityConfigurationScreen]: undefined
  [settingsStackRouteNames.FeedbackScreen]: undefined
  [settingsStackRouteNames.ShowMnemonicScreen]: undefined
  [settingsStackRouteNames.ChangePinScreen]: undefined
  [settingsStackRouteNames.ExampleScreen]: undefined
}

export type SettingsScreenProps<T extends keyof SettingsStackParamsList> =
  CompositeScreenProps<
    StackScreenProps<SettingsStackParamsList, T>,
    RootTabsScreenProps<rootTabsRouteNames.Settings>
  >
