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
  [settingsStackRouteNames.ExampleScreen]: undefined
  [settingsStackRouteNames.RelayDeployScreen]:
    | {
        goBackScreen:
          | {
              parent: rootTabsRouteNames.Home
              child: homeStackRouteNames.Send
            }
          | {
              parent: rootTabsRouteNames.Profile
              child: profileStackRouteNames.ProfileCreateScreen
            }
      }
    | undefined
}

export type SettingsScreenProps<T extends keyof SettingsStackParamsList> =
  CompositeScreenProps<
    StackScreenProps<SettingsStackParamsList, T>,
    RootTabsScreenProps<rootTabsRouteNames.Settings>
  >
