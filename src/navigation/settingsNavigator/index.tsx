import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'

import {
  ChangeLanguageScreen,
  ChangePinScreen,
  FeedbackScreen,
  SecurityConfigurationScreen,
  SettingsScreen,
  ShowMnemonicScreen,
} from 'screens/index'
import { InjectedScreens } from 'core/Core'
import { AppHeader } from 'src/ux/appHeader'
import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { SettingsStackParamsList, settingsStackRouteNames } from './types'
import { hasPin } from 'src/storage/MainStorage'

const SettingsStack = createStackNavigator<SettingsStackParamsList>()

export const SettingsNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Settings>) => {
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [])

  return (
    <SettingsStack.Navigator
      initialRouteName={
        !hasPin()
          ? settingsStackRouteNames.ChangePinScreen
          : settingsStackRouteNames.SettingsScreen
      }
      screenOptions={{
        header: props => <AppHeader {...props} />,
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
      <SettingsStack.Screen
        name={settingsStackRouteNames.ChangePinScreen}
        component={ChangePinScreen}
      />
    </SettingsStack.Navigator>
  )
}
