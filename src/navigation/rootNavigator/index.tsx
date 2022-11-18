import { createStackNavigator } from '@react-navigation/stack'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import JailMonkey from 'jail-monkey'

import { InjectSelectedWallet } from '../../Context'
import { IRifWalletServicesSocket } from '../../lib/rifWalletServices/RifWalletServicesSocket'

import * as Screens from '../../screens'
import {
  CreateKeysNavigation,
  CreateKeysProps,
} from 'navigation/createKeysNavigator'
import { colors } from '../../styles'
import { AppFooterMenu } from '../../ux/appFooter'
import { AppHeader } from '../../ux/appHeader'

import { emptyProfile, useProfile } from '../../core/hooks/useProfile'
import { ConfirmationModal } from '../../components/modal/ConfirmationModal'
import {
  RootStackParamList,
  rootStackRouteNames,
  RootStackScreenProps,
} from './types'

const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  BalancesScreen: InjectSelectedWallet(Screens.BalancesScreen),
  ActivityScreen: InjectSelectedWallet(Screens.ActivityScreen),
  ActivityDetailsScreen: InjectSelectedWallet(Screens.ActivityDetailsScreen),
  ManuallyDeployScreen: InjectSelectedWallet(Screens.ManuallyDeployScreen),
  WalletConnectScreen: InjectSelectedWallet(Screens.WalletConnectScreen),
  ScanQRScreen: InjectSelectedWallet(Screens.ScanQRScreen),
  RNSManagerScreen: InjectSelectedWallet(Screens.RNSManagerScreen),
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
  hasKeys: boolean
  hasPin: boolean
  isKeyboardVisible: boolean
  changeTopColor: (color: string) => void
  rifWalletServicesSocket: IRifWalletServicesSocket
  keyManagementProps: CreateKeysProps
  createPin: (newPin: string) => Promise<void>
  editPin: (newPin: string) => void
  setWalletIsDeployed: (address: string, value?: boolean) => void
  balancesScreenProps: Screens.BalancesScreenProps
  activityScreenProps: Screens.ActivityScreenProps
  showMnemonicScreenProps: Screens.ShowMnemonicScreenProps
  sendScreenProps: RootStackScreenProps<'Send'>
  walletConnectScreenProps: RootStackScreenProps<'WalletConnect'>
  accountsScreenType: Screens.AccountsScreenType
  securityConfigurationScreenProps: Screens.SecurityScreenProps
}

export const RootNavigationComponent = ({
  currentScreen,
  hasKeys,
  hasPin,
  isKeyboardVisible,
  changeTopColor,
  keyManagementProps,
  createPin,
  editPin,
  balancesScreenProps,
  activityScreenProps,
  showMnemonicScreenProps,
  sendScreenProps,
  walletConnectScreenProps,
  accountsScreenType,
  securityConfigurationScreenProps,
  setWalletIsDeployed,
}: Props) => {
  const { profile, setProfile, storeProfile, eraseProfile, profileCreated } =
    useProfile(emptyProfile)

  const isDeviceRooted = JailMonkey.isJailBroken()
  const [isWarningVisible, setIsWarningVisible] = useState(isDeviceRooted)

  let initialRoute: rootStackRouteNames = rootStackRouteNames.CreateKeysUX
  if (hasPin) {
    initialRoute = rootStackRouteNames.Home
  } else if (hasKeys) {
    initialRoute = rootStackRouteNames.ChangePinScreen
  }

  const appIsSetup = hasKeys && hasPin

  return (
    <View style={styles.parent}>
      {appIsSetup && (
        <AppHeader profile={profile} profileCreated={profileCreated} />
      )}
      <RootStack.Navigator initialRouteName={initialRoute}>
        <RootStack.Screen
          name={rootStackRouteNames.Home}
          options={sharedOptions}>
          {props => (
            <InjectedScreens.HomeScreen
              {...props}
              changeTopColor={changeTopColor}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.WalletConnect}
          options={sharedOptions}>
          {props => (
            <InjectedScreens.WalletConnectScreen
              {...props}
              {...walletConnectScreenProps}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.ScanQR}
          component={InjectedScreens.ScanQRScreen}
          options={sharedOptions}
        />

        <RootStack.Screen
          name={rootStackRouteNames.Settings}
          options={sharedOptions}
          component={Screens.SettingsScreen}
        />
        <RootStack.Screen
          name={rootStackRouteNames.CreateKeysUX}
          options={sharedOptions}>
          {props => (
            <CreateKeysNavigation
              {...props}
              {...keyManagementProps}
              isKeyboardVisible={isKeyboardVisible}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.Receive}
          component={Screens.ReceiveScreenHOC}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.Send}
          options={sharedOptions}>
          {props => (
            <InjectedScreens.SendScreen {...props} {...sendScreenProps} />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.ReceiveBitcoin}
          component={Screens.BitcoinReceiveScreen}
          options={sharedOptions}
        />
        <RootStack.Screen name={rootStackRouteNames.Balances}>
          {props => (
            <InjectedScreens.BalancesScreen
              {...props}
              {...balancesScreenProps}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.Activity}
          options={sharedOptions}>
          {props => (
            <InjectedScreens.ActivityScreen
              {...props}
              {...activityScreenProps}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.ActivityDetails}
          component={InjectedScreens.ActivityDetailsScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.ManuallyDeployScreen}
          options={sharedOptions}>
          {props => (
            <InjectedScreens.ManuallyDeployScreen
              {...props}
              setWalletIsDeployed={setWalletIsDeployed}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.AccountsScreen}
          options={sharedOptions}>
          {props => (
            <InjectedScreens.AccountsScreen
              {...props}
              {...accountsScreenType}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.ShowMnemonicScreen}
          options={sharedOptions}>
          {props => (
            <Screens.ShowMnemonicScreen
              {...props}
              {...showMnemonicScreenProps}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.RNSManager}
          options={sharedOptions}>
          {props => (
            <InjectedScreens.RNSManagerScreen
              {...props}
              profile={profile}
              setProfile={setProfile}
            />
          )}
        </RootStack.Screen>

        <RootStack.Screen
          name={rootStackRouteNames.SearchDomain}
          options={sharedOptions}
          component={InjectedScreens.SearchDomainScreen}
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
          options={sharedOptions}>
          {props => (
            <InjectedScreens.AliasBoughtScreen
              {...props}
              profile={profile}
              setProfile={setProfile}
            />
          )}
        </RootStack.Screen>

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
          options={sharedOptions}>
          {props => (
            <Screens.CreatePinScreen {...props} createPin={createPin} />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.ChangePinScreen}
          options={sharedOptions}>
          {props => <Screens.ChangePinScreen {...props} editPin={editPin} />}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.Contacts}
          options={sharedOptions}
          component={Screens.ContactsNavigation}
        />
        <RootStack.Screen
          name={rootStackRouteNames.EventsScreen}
          component={Screens.EventsScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name={rootStackRouteNames.SecurityConfigurationScreen}
          options={sharedOptions}>
          {props => (
            <Screens.SecurityConfigurationScreen
              {...props}
              {...securityConfigurationScreenProps}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.ProfileCreateScreen}
          options={sharedOptions}>
          {props => (
            <Screens.ProfileCreateScreen
              {...props}
              profile={profile}
              setProfile={setProfile}
              storeProfile={storeProfile}
              eraseProfile={eraseProfile}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.ProfileDetailsScreen}
          options={sharedOptions}>
          {props => (
            <Screens.ProfileDetailsScreen {...props} profile={profile} />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name={rootStackRouteNames.FeedbackScreen}
          component={Screens.FeedbackScreen}
          options={sharedOptions}
        />
      </RootStack.Navigator>
      {appIsSetup && !isKeyboardVisible && (
        <AppFooterMenu currentScreen={currentScreen} />
      )}
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
    height: '100%',
  },
})

export * from './types'
