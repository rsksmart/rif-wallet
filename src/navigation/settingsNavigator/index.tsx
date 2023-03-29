import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
import { Typography } from 'components/typography'
import { sharedColors } from 'shared/constants'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { SettingsStackParamsList, settingsStackRouteNames } from './types'

const SettingsStack = createStackNavigator<SettingsStackParamsList>()

const settingsNavigatorOptions = (
  title: string,
  topInset: number,
): StackNavigationOptions => ({
  headerShown: true,
  headerTitle: props => (
    <Typography type={'h3'} style={headerStyles.headerPosition}>
      {title ?? props.children}
    </Typography>
  ),
  headerStyle: [
    headerStyles.headerStyle,
    { backgroundColor: sharedColors.secondary, height: 54 + topInset },
  ],
  headerTitleContainerStyle: {
    paddingTop: topInset,
  },
  headerLeftContainerStyle: {
    paddingTop: topInset,
  },
  headerShadowVisible: false,
})

export const SettingsNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Settings>) => {
  const { top } = useSafeAreaInsets()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])
  const { t } = useTranslation()

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name={settingsStackRouteNames.SettingsScreen}
        component={SettingsScreen}
        options={settingsNavigatorOptions(t('settings_screen_title'), top)}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.AccountsScreen}
        component={InjectedScreens.AccountsScreen}
        options={settingsNavigatorOptions(t('settings_screen_accounts'), top)}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.FeedbackScreen}
        component={FeedbackScreen}
        options={settingsNavigatorOptions(
          t('settings_screen_provide_feedback'),
          top,
        )}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.SecurityConfigurationScreen}
        component={SecurityConfigurationScreen}
        options={settingsNavigatorOptions(
          t('settings_screen_wallet_backup'),
          top,
        )}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.ChangeLanguage}
        component={ChangeLanguageScreen}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.ShowMnemonicScreen}
        component={ShowMnemonicScreen}
        options={settingsNavigatorOptions(
          t('settings_screen_wallet_backup'),
          top,
        )}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.ExampleScreen}
        component={ExampleScreen}
        options={settingsNavigatorOptions(t('Example Screen'), top)}
      />
    </SettingsStack.Navigator>
  )
}
