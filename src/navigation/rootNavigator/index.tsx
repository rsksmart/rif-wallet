import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import JailMonkey from 'jail-monkey'
import { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { CreateKeysNavigation } from 'navigation/createKeysNavigator'
import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import { InjectedScreens } from 'core/Core'
import { useAppSelector } from 'store/storeUtils'
import { selectFullscreen, selectIsUnlocked } from 'store/slices/settingsSlice'
import { TransactionSummary } from 'screens/transactionSummary'
import { AppFooterMenu } from 'src/ux/appFooter'
import { sharedStyles } from 'shared/constants'

import { RootTabsParamsList, rootTabsRouteNames } from './types'
import { HomeNavigator } from '../homeNavigator'
import { ContactsNavigation } from '../contactsNavigator'
import { SettingsNavigator } from '../settingsNavigator'
import { ProfileNavigator } from '../profileNavigator'
import { screenOptionsWithAppHeader, screenOptionsWithHeader } from '..'

const RootTabs = createBottomTabNavigator<RootTabsParamsList>()

export const RootNavigationComponent = () => {
  const { top } = useSafeAreaInsets()
  const { t } = useTranslation()
  const isDeviceRooted = JailMonkey.isJailBroken()
  const [isWarningVisible, setIsWarningVisible] = useState(isDeviceRooted)
  const unlocked = useAppSelector(selectIsUnlocked)
  const fullscreen = useAppSelector(selectFullscreen)
  const isShown = unlocked && !fullscreen

  return (
    <View style={sharedStyles.flex}>
      <RootTabs.Navigator
        tabBar={props => <AppFooterMenu isShown={isShown} {...props} />}>
        {!unlocked ? (
          <RootTabs.Screen
            name={rootTabsRouteNames.CreateKeysUX}
            component={CreateKeysNavigation}
            options={{ headerShown: false }}
          />
        ) : (
          <RootTabs.Group>
            <RootTabs.Group screenOptions={screenOptionsWithAppHeader}>
              <RootTabs.Screen
                name={rootTabsRouteNames.Home}
                component={HomeNavigator}
              />
              <RootTabs.Screen
                name={rootTabsRouteNames.Activity}
                component={InjectedScreens.ActivityScreen}
              />
              <RootTabs.Screen
                name={rootTabsRouteNames.ActivityDetails}
                component={InjectedScreens.ActivityDetailsScreen}
              />
              <RootTabs.Screen
                name={rootTabsRouteNames.ScanQR}
                component={InjectedScreens.ScanQRScreen}
              />
              <RootTabs.Screen
                name={rootTabsRouteNames.Contacts}
                component={ContactsNavigation}
              />
              <RootTabs.Screen
                name={rootTabsRouteNames.WalletConnect}
                component={InjectedScreens.WalletConnectScreen}
              />
              <RootTabs.Screen
                name={rootTabsRouteNames.Settings}
                component={SettingsNavigator}
              />
              <RootTabs.Screen
                name={rootTabsRouteNames.Profile}
                component={ProfileNavigator}
              />
              <RootTabs.Screen
                name={rootTabsRouteNames.CreateKeysUX}
                component={CreateKeysNavigation}
              />
            </RootTabs.Group>
            <RootTabs.Group
              screenOptions={screenOptionsWithHeader(
                top,
                t('transaction_summary_screen_title'),
              )}>
              <RootTabs.Screen
                name={rootTabsRouteNames.TransactionSummary}
                component={TransactionSummary}
              />
            </RootTabs.Group>
          </RootTabs.Group>
        )}
      </RootTabs.Navigator>
      <ConfirmationModal
        isVisible={isWarningVisible}
        title="DEVICE SECURITY COMPROMISED"
        description='Any "rooted" app can access your private keys and steal your funds. Wipe this wallet immediately and restore it on a secure device.'
        okText="OK"
        onOk={() => setIsWarningVisible(false)}
      />
    </View>
  )
}

export * from './types'
