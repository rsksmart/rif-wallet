import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import JailMonkey from 'jail-monkey'
import { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import { CreateKeysNavigation } from 'navigation/createKeysNavigator'
import { ConfirmationModal } from 'components/modal'
import { InjectedScreens } from 'core/Core'
import { useAppSelector } from 'store/storeUtils'
import { selectFullscreen, selectIsUnlocked } from 'store/slices/settingsSlice'
import { TransactionSummaryScreen } from 'screens/transactionSummary'
import { AppFooterMenu } from 'src/ux/appFooter'
import { sharedStyles } from 'shared/constants'
import { PinScreen } from 'src/screens/pinScreen'

import { RootTabsParamsList, rootTabsRouteNames } from './types'
import { HomeNavigator } from '../homeNavigator'
import { ContactsNavigation } from '../contactsNavigator'
import { SettingsNavigator } from '../settingsNavigator'
import { ProfileNavigator } from '../profileNavigator'
import {
  screenOptionsNoHeader,
  screenOptionsWithAppHeader,
  screenOptionsWithHeader,
} from '..'

const RootTabs = createBottomTabNavigator<RootTabsParamsList>()

export const RootNavigationComponent = () => {
  const { t } = useTranslation()
  const { top } = useSafeAreaInsets()
  const isDeviceRooted = JailMonkey.isJailBroken()
  const [isWarningVisible, setIsWarningVisible] = useState(isDeviceRooted)
  const unlocked = useAppSelector(selectIsUnlocked)
  const fullscreen = useAppSelector(selectFullscreen)
  const isShown = unlocked && !fullscreen

  return (
    <View style={sharedStyles.flex}>
      <RootTabs.Navigator
        tabBar={props => (!isShown ? null : <AppFooterMenu {...props} />)}>
        {!unlocked ? (
          <>
            <RootTabs.Screen
              name={rootTabsRouteNames.CreateKeysUX}
              component={CreateKeysNavigation}
              options={screenOptionsNoHeader}
            />
            <RootTabs.Screen
              name={rootTabsRouteNames.InitialPinScreen}
              component={PinScreen}
              options={screenOptionsWithHeader(
                top,
                t('pin_screen_header_title'),
                undefined,
                undefined,
                true,
              )}
            />
          </>
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
            </RootTabs.Group>
            <RootTabs.Group
              screenOptions={screenOptionsWithHeader(
                top,
                t('transaction_summary_screen_title'),
              )}>
              <RootTabs.Screen
                name={rootTabsRouteNames.TransactionSummary}
                component={TransactionSummaryScreen}
              />
            </RootTabs.Group>
            <RootTabs.Screen
              name={rootTabsRouteNames.CreateKeysUX}
              component={CreateKeysNavigation}
              options={screenOptionsNoHeader}
            />
          </RootTabs.Group>
        )}
      </RootTabs.Navigator>
      <ConfirmationModal
        isVisible={isWarningVisible}
        title={t('device_compromised')}
        description={t('device_compomised_description')}
        okText={t('ok')}
        onOk={() => setIsWarningVisible(false)}
      />
    </View>
  )
}

export * from './types'
