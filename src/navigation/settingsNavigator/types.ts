import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { homeStackRouteNames } from '../homeNavigator/types'
import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { profileStackRouteNames } from '../profileNavigator/types'

export enum settingsStackRouteNames {
  SettingsScreen = 'SettingsScreen',
  ChangeLanguage = 'ChangeLanguage',
  ChangePinScreen = 'ChangePinScreen',
  AccountsScreen = 'AccountsScreen',
  WalletBackup = 'WalletBackup',
  ShowMnemonicScreen = 'ShowMnemonicScreen',
  ExampleScreen = 'ExampleScreen',
  RelayDeployScreen = 'RelayDeployScreen',
}

export type SettingsStackParamsList = {
  [settingsStackRouteNames.SettingsScreen]: undefined
  [settingsStackRouteNames.ChangeLanguage]: undefined
  [settingsStackRouteNames.ChangePinScreen]: {
    isChangeRequested: true
    backScreen?: settingsStackRouteNames.SettingsScreen
  }
  [settingsStackRouteNames.AccountsScreen]: undefined
  [settingsStackRouteNames.WalletBackup]: undefined
  [settingsStackRouteNames.ShowMnemonicScreen]: undefined
  [settingsStackRouteNames.ExampleScreen]: undefined
  [settingsStackRouteNames.RelayDeployScreen]:
    | {
        goBackScreen: {
          parent: rootTabsRouteNames
          child?: homeStackRouteNames | profileStackRouteNames
        }
      }
    | undefined
}

export type SettingsScreenProps<T extends keyof SettingsStackParamsList> =
  CompositeScreenProps<
    StackScreenProps<SettingsStackParamsList, T>,
    RootTabsScreenProps<rootTabsRouteNames.Settings>
  >
