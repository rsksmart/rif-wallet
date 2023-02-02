import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'

import {
  ChangeLanguageScreen,
  FeedbackScreen,
  SecurityConfigurationScreen,
  SettingsScreen,
  ShowMnemonicScreen,
} from 'screens/index'
import { InjectedScreens } from 'core/Core'
import { AppHeader } from 'src/ux/appHeader'
import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { SettingsStackParamsList, settingsStackRouteNames } from './types'

const SettingsStack = createStackNavigator<SettingsStackParamsList>()

export const SettingsNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Settings>) => {
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <SettingsStack.Navigator
      screenOptions={{
        header: props => <AppHeader isShown={true} {...props} />,
      }}>
      <SettingsStack.Screen
        name={settingsStackRouteNames.SettingsScreen}
        component={SettingsScreen}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.AccountsScreen}
        component={InjectedScreens.AccountsScreen}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.FeedbackScreen}
        component={FeedbackScreen}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.SecurityConfigurationScreen}
        component={SecurityConfigurationScreen}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.ChangeLanguage}
        component={ChangeLanguageScreen}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.ShowMnemonicScreen}
        component={ShowMnemonicScreen}
      />
    </SettingsStack.Navigator>
  )
}
