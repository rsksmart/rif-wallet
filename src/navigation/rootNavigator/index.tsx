import { createStackNavigator } from '@react-navigation/stack'
import JailMonkey from 'jail-monkey'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { InjectSelectedWallet } from '../../Context'

import * as Screens from '../../screens'
import { CreateKeysNavigation } from 'navigation/createKeysNavigator'
import { colors } from '../../styles'
import { AppFooterMenu } from '../../ux/appFooter'
import { AppHeader } from '../../ux/appHeader'

import { ConfirmationModal } from 'components/modal/ConfirmationModal'
import { RootStackParamList, rootStackRouteNames } from './types'
import { hasKeys, hasPin } from 'storage/MainStorage'

const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  BalancesScreen: InjectSelectedWallet(Screens.BalancesScreen),
  ActivityScreen: InjectSelectedWallet(Screens.ActivityScreen),
  ActivityDetailsScreen: InjectSelectedWallet(Screens.ActivityDetailsScreen),
  RelayDeployScreen: InjectSelectedWallet(Screens.RelayDeployScreen),
  WalletConnectScreen: InjectSelectedWallet(Screens.WalletConnectScreen),
  ScanQRScreen: InjectSelectedWallet(Screens.ScanQRScreen),
  SearchDomainScreen: InjectSelectedWallet(Screens.SearchDomainScreen),
  RequestDomainScreen: InjectSelectedWallet(Screens.RequestDomainScreen),
  RegisterDomainScreen: InjectSelectedWallet(Screens.RegisterDomainScreen),
  BuyDomainScreen: InjectSelectedWallet(Screens.BuyDomainScreen),
  AliasBoughtScreen: InjectSelectedWallet(Screens.AliasBoughtScreen),
  HomeScreen: InjectSelectedWallet(Screens.HomeScreen),
  AccountsScreen: InjectSelectedWallet(Screens.AccountsScreen),
}

const RootStack = createStackNavigator<RootStackParamList>()

const sharedOptions = {
  headerShown: false,
  cardStyle: {
    backgroundColor: colors.blue,
  },
}

interface Props {
  currentScreen: string
}

export const RootNavigationComponent = ({ currentScreen }: Props) => {
  const isDeviceRooted = JailMonkey.isJailBroken()
  const [isWarningVisible, setIsWarningVisible] = useState(isDeviceRooted)

  let initialRoute: rootStackRouteNames = rootStackRouteNames.CreateKeysUX
  if (hasPin()) {
    initialRoute = rootStackRouteNames.Home
  } else if (hasKeys()) {
    initialRoute = rootStackRouteNames.ChangePinScreen
  }

  const appIsSetup = hasKeys() && hasPin()

  return (
    <View style={styles.parent}>
      {appIsSetup && <AppHeader />}
      <RootStack.Navigator initialRouteName={initialRoute}>
        <RootStack.Screen
          name={rootStackRouteNames.Home}
          component={InjectedScreens.HomeScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.WalletConnect}
          component={InjectedScreens.WalletConnectScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.ScanQR}
          component={InjectedScreens.ScanQRScreen}
          options={sharedOptions}
        />

        <RootStack.Screen
          name={rootStackRouteNames.Settings}
          component={Screens.SettingsScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.CreateKeysUX}
          component={CreateKeysNavigation}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.Receive}
          component={Screens.ReceiveScreenHOC}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.Send}
          component={InjectedScreens.SendScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.ReceiveBitcoin}
          component={Screens.BitcoinReceiveScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.Balances}
          component={InjectedScreens.BalancesScreen}
        />
        <RootStack.Screen
          name={rootStackRouteNames.Activity}
          component={InjectedScreens.ActivityScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.ActivityDetails}
          component={InjectedScreens.ActivityDetailsScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.RelayDeployScreen}
          component={InjectedScreens.RelayDeployScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.AccountsScreen}
          component={InjectedScreens.AccountsScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.ShowMnemonicScreen}
          component={Screens.ShowMnemonicScreen}
          options={sharedOptions}
        />

        <RootStack.Screen
          name={rootStackRouteNames.SearchDomain}
          component={InjectedScreens.SearchDomainScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.RequestDomain}
          options={sharedOptions}
          component={InjectedScreens.RequestDomainScreen}
        />

        <RootStack.Screen
          name={rootStackRouteNames.BuyDomain}
          options={sharedOptions}
          component={InjectedScreens.BuyDomainScreen}
        />

        <RootStack.Screen
          name={rootStackRouteNames.AliasBought}
          component={InjectedScreens.AliasBoughtScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.RegisterDomain}
          component={InjectedScreens.RegisterDomainScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.ChangeLanguage}
          component={Screens.ChangeLanguageScreen}
          options={sharedOptions}
        />

        <RootStack.Screen
          name={rootStackRouteNames.CreatePin}
          options={sharedOptions}
          component={Screens.CreatePinScreen}
        />
        <RootStack.Screen
          name={rootStackRouteNames.ChangePinScreen}
          options={sharedOptions}
          component={Screens.ChangePinScreen}
        />
        <RootStack.Screen
          name={rootStackRouteNames.Contacts}
          options={sharedOptions}
          component={Screens.ContactsNavigation}
        />
        <RootStack.Screen
          name={rootStackRouteNames.SecurityConfigurationScreen}
          component={Screens.SecurityConfigurationScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.ProfileCreateScreen}
          component={Screens.ProfileCreateScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.ProfileDetailsScreen}
          component={Screens.ProfileDetailsScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.FeedbackScreen}
          component={Screens.FeedbackScreen}
          options={sharedOptions}
        />
      </RootStack.Navigator>
      {appIsSetup && <AppFooterMenu currentScreen={currentScreen} />}
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
