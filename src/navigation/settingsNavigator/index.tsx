import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
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
import { headerStyles } from 'navigation/profileNavigator'
import { Typography } from 'src/components'
import { sharedColors } from 'shared/constants'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { SettingsStackParamsList, settingsStackRouteNames } from './types'

const SettingsStack = createStackNavigator<SettingsStackParamsList>()

const settingsNavigatorOptions = (title: string): StackNavigationOptions => ({
  headerShown: true,
  headerTitle: props => (
    <Typography type={'h3'} style={headerStyles.headerPosition}>
      {title ?? props.children}
    </Typography>
  ),
  headerStyle: [
    headerStyles.headerStyle,
    { backgroundColor: sharedColors.tokenBackground },
  ],
  headerShadowVisible: false,
})
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
        options={settingsNavigatorOptions(t('settings_screen_title'))}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.AccountsScreen}
        component={InjectedScreens.AccountsScreen}
        options={settingsNavigatorOptions(t('settings_screen_accounts'))}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.FeedbackScreen}
        component={FeedbackScreen}
        options={settingsNavigatorOptions(
          t('settings_screen_provide_feedback'),
        )}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.SecurityConfigurationScreen}
        component={SecurityConfigurationScreen}
        options={settingsNavigatorOptions(t('settings_screen_wallet_backup'))}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.ChangeLanguage}
        component={ChangeLanguageScreen}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.ShowMnemonicScreen}
        component={ShowMnemonicScreen}
        options={settingsNavigatorOptions(t('settings_screen_wallet_backup'))}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.ExampleScreen}
        component={ExampleScreen}
      />
    </SettingsStack.Navigator>
  )
}
