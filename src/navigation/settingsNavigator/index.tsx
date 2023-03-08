import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ChangeLanguageScreen,
  FeedbackScreen,
  SecurityConfigurationScreen,
  SettingsScreen,
  ShowMnemonicScreen,
} from 'screens/index'
import { InjectedScreens } from 'core/Core'
import { ExampleScreen } from 'screens/example'
import { screenOptionsWithHeader } from 'navigation/profileNavigator'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { SettingsStackParamsList, settingsStackRouteNames } from './types'

const SettingsStack = createStackNavigator<SettingsStackParamsList>()

export const SettingsNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Settings>) => {
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])
  const { t } = useTranslation()

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name={settingsStackRouteNames.SettingsScreen}
        component={SettingsScreen}
        options={screenOptionsWithHeader(t('settings_screen_title'))}
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
        name={settingsStackRouteNames.ExampleScreen}
        component={ExampleScreen}
      />
    </SettingsStack.Navigator>
  )
}
