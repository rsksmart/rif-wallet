import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import JailMonkey from 'jail-monkey'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { CreateKeysNavigation } from 'navigation/createKeysNavigator'
import { AppFooterMenu } from '../../ux/appFooter'
import { AppHeader } from '../../ux/appHeader'

import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import { rootTabsRouteNames } from './types'
import { InjectedScreens } from 'core/Core'
import { HomeNavigator } from '../homeNavigator'
import { ContactsNavigation } from '../contactsNavigator'
import { SettingsNavigator } from '../settingsNavigator'
import { ProfileNavigator } from '../profileNavigator'
import { useAppSelector } from 'store/storeUtils'
import { selectIsUnlocked } from 'store/slices/settingsSlice'

const RootTabs = createBottomTabNavigator()

export const RootNavigationComponent = () => {
  const isDeviceRooted = JailMonkey.isJailBroken()
  const [isWarningVisible, setIsWarningVisible] = useState(isDeviceRooted)
  const unlocked = useAppSelector(selectIsUnlocked)

  return (
    <View style={styles.parent}>
      <RootTabs.Navigator
        tabBar={props => <AppFooterMenu isShown={unlocked} {...props} />}
        screenOptions={{
          header: props => <AppHeader isShown={unlocked} {...props} />,
          tabBarHideOnKeyboard: true,
        }}>
        {!unlocked ? (
          <RootTabs.Screen
            name={rootTabsRouteNames.CreateKeysUX}
            component={CreateKeysNavigation}
          />
        ) : (
          <RootTabs.Group>
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

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
})

export * from './types'
