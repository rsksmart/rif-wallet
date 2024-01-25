import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  AccountsScreen,
  RelayDeployScreen,
  SettingsScreen,
} from 'screens/index'
import { ExampleScreen } from 'screens/example'
import { WalletBackup } from 'screens/settings/WalletBackup'
import { PinScreen } from 'src/screens/pinScreen'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { SettingsStackParamsList, settingsStackRouteNames } from './types'
import { screenOptionsWithHeader } from '..'

const SettingsStack = createStackNavigator<SettingsStackParamsList>()

export const SettingsNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Settings>) => {
  const { t } = useTranslation()
  const { top } = useSafeAreaInsets()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name={settingsStackRouteNames.SettingsScreen}
        component={SettingsScreen}
        options={screenOptionsWithHeader(top, t('settings_screen_title'))}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.AccountsScreen}
        component={AccountsScreen}
        options={screenOptionsWithHeader(top, t('settings_screen_accounts'))}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.WalletBackup}
        component={WalletBackup}
        options={screenOptionsWithHeader(
          top,
          t('settings_screen_wallet_backup'),
        )}
      />
      <SettingsStack.Screen
        name={settingsStackRouteNames.ExampleScreen}
        component={ExampleScreen}
        options={screenOptionsWithHeader(top, t('Example Screen'))}
      />

      <SettingsStack.Screen
        name={settingsStackRouteNames.ChangePinScreen}
        component={PinScreen}
        options={screenOptionsWithHeader(top, t('pin_screen_header_title'))}
      />

      <SettingsStack.Screen
        name={settingsStackRouteNames.RelayDeployScreen}
        component={RelayDeployScreen}
        options={screenOptionsWithHeader(top, '')}
      />
    </SettingsStack.Navigator>
  )
}
