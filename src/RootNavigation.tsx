import { NavigationProp as _NavigationProp } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { InjectSelectedWallet } from './Context'
import { IRifWalletServicesSocket } from './lib/rifWalletServices/RifWalletServicesSocket'

import JailMonkey from 'jail-monkey'
import BitcoinNetwork from './lib/bitcoin/BitcoinNetwork'
import * as Screens from './screens'
import { CreateKeysNavigation, CreateKeysProps } from './screens/createKeys'
import { colors } from './styles'
import { AppFooterMenu } from './ux/appFooter'
import { AppHeader } from './ux/appHeader'

import { emptyProfile, useProfile } from './core/hooks/useProfile'
import { ConfirmationModal } from './components/modal/ConfirmationModal'

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

type RootStackParamList = {
  Home: undefined
  Send:
    | undefined
    | {
        token?: string
        to?: string
        displayTo?: string
        contractAddress?: string
      }
  Receive: undefined
  ReceiveBitcoin: {
    network: BitcoinNetwork
  }
  Balances: undefined
  Activity: undefined
  ActivityDetails: undefined
  SignMessage: undefined
  SignTypedData: undefined
  TransactionReceived: undefined
  ManuallyDeployScreen: undefined
  CreateKeysUX: undefined
  ShowMnemonicScreen: undefined
  WalletConnect: undefined | { wcKey?: string }
  ScanQR: undefined
  ChangeLanguage: undefined
  ManagePin: undefined
  CreatePin: undefined
  RNSManager: undefined
  SearchDomain: undefined
  RequestDomain: undefined
  BuyDomain: undefined
  AliasBought: undefined
  RegisterDomain: { selectedDomain: string; years: number }
  Contacts: undefined
  Settings: undefined
  EventsScreen: undefined
  AccountsScreen: undefined
  SecurityConfigurationScreen: undefined
  ProfileCreateScreen: undefined
  ProfileDetailsScreen: undefined
  ChangePinScreen: undefined
  FeedbackScreen: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()
export type NavigationProp = _NavigationProp<RootStackParamList>

const sharedOptions = {
  headerShown: false,
  cardStyle: {
    backgroundColor: colors.blue,
  },
}

export type ScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>

export const RootNavigation: React.FC<{
  currentScreen: string
  hasKeys: boolean
  hasPin: boolean
  isKeyboardVisible: boolean
  changeTopColor: (color: string) => void
  keyManagementProps: CreateKeysProps
  createPin: (newPin: string) => Promise<void>
  editPin: (newPin: string) => Promise<void>
  setWalletIsDeployed: (address: string, value?: boolean) => void
  balancesScreenProps: Screens.BalancesScreenProps
  activityScreenProps: Screens.ActivityScreenProps
  showMnemonicScreenProps: Screens.ShowMnemonicScreenProps
  sendScreenProps: ScreenProps<'Send'>
  contactsNavigationScreenProps: Screens.ContactsScreenProps
  walletConnectScreenProps: ScreenProps<'WalletConnect'>
  accountsScreenType: Screens.AccountsScreenType
  securityConfigurationScreenProps: Screens.SecurityScreenProps
}> = ({
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
  contactsNavigationScreenProps,
  walletConnectScreenProps,
  accountsScreenType,
  securityConfigurationScreenProps,
  setWalletIsDeployed,
}) => {
  const { profile, setProfile, storeProfile, eraseProfile, profileCreated } =
    useProfile(emptyProfile)

  const isDeviceRooted = JailMonkey.isJailBroken()
  const [isWarningVisible, setIsWarningVisible] = useState(isDeviceRooted)

  let initialRoute: any = 'CreateKeysUX'
  if (hasPin) {
    initialRoute = 'Home'
  } else if (hasKeys && !hasPin) {
    initialRoute = 'CreatePin'
  }

  const appIsSetup = hasKeys && hasPin

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.parent}>
        {appIsSetup && (
          <AppHeader profile={profile} profileCreated={profileCreated} />
        )}
        <RootStack.Navigator initialRouteName={initialRoute}>
          <RootStack.Screen name="Home" options={sharedOptions}>
            {props => (
              <InjectedScreens.HomeScreen
                {...props}
                changeTopColor={changeTopColor}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="WalletConnect" options={sharedOptions}>
            {props => (
              <InjectedScreens.WalletConnectScreen
                {...props}
                {...walletConnectScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="ScanQR" options={sharedOptions}>
            {_ => <InjectedScreens.ScanQRScreen />}
          </RootStack.Screen>

          <RootStack.Screen name="Settings" options={sharedOptions}>
            {props => <Screens.SettingsScreen {...props} />}
          </RootStack.Screen>
          <RootStack.Screen name="CreateKeysUX" options={sharedOptions}>
            {props => (
              <CreateKeysNavigation
                {...props}
                {...keyManagementProps}
                isKeyboardVisible={isKeyboardVisible}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            component={Screens.ReceiveScreenHOC}
            name="Receive"
            options={sharedOptions}
          />
          <RootStack.Screen name="Send" options={sharedOptions}>
            {props => (
              <InjectedScreens.SendScreen {...props} {...sendScreenProps} />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="ReceiveBitcoin"
            component={Screens.BitcoinReceiveScreen}
            options={sharedOptions}
          />
          <RootStack.Screen name="Balances">
            {props => (
              <InjectedScreens.BalancesScreen
                {...props}
                {...balancesScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="Activity" options={sharedOptions}>
            {props => (
              <InjectedScreens.ActivityScreen
                {...props}
                {...activityScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="ActivityDetails"
            component={InjectedScreens.ActivityDetailsScreen}
            options={sharedOptions}
          />
          <RootStack.Screen name="ManuallyDeployScreen" options={sharedOptions}>
            {props => (
              <InjectedScreens.ManuallyDeployScreen
                {...props}
                setWalletIsDeployed={setWalletIsDeployed}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="AccountsScreen" options={sharedOptions}>
            {props => (
              <InjectedScreens.AccountsScreen
                {...props}
                {...accountsScreenType}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="ShowMnemonicScreen" options={sharedOptions}>
            {props => (
              <Screens.ShowMnemonicScreen
                {...props}
                {...showMnemonicScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="RNSManager" options={sharedOptions}>
            {props => (
              <InjectedScreens.RNSManagerScreen
                {...props}
                profile={profile}
                setProfile={setProfile}
              />
            )}
          </RootStack.Screen>

          <RootStack.Screen name="SearchDomain" options={sharedOptions}>
            {props => <InjectedScreens.SearchDomainScreen {...props} />}
          </RootStack.Screen>
          <RootStack.Screen name="RequestDomain" options={sharedOptions}>
            {props => <InjectedScreens.RequestDomainScreen {...props} />}
          </RootStack.Screen>

          <RootStack.Screen name="BuyDomain" options={sharedOptions}>
            {props => <InjectedScreens.BuyDomainScreen {...props} />}
          </RootStack.Screen>

          <RootStack.Screen name="AliasBought" options={sharedOptions}>
            {props => (
              <InjectedScreens.AliasBoughtScreen
                {...props}
                profile={profile}
                setProfile={setProfile}
              />
            )}
          </RootStack.Screen>

          <RootStack.Screen
            name="RegisterDomain"
            component={InjectedScreens.RegisterDomainScreen}
            options={sharedOptions}
          />
          <RootStack.Screen
            name="ChangeLanguage"
            component={Screens.ChangeLanguageScreen}
            options={sharedOptions}
          />

          <RootStack.Screen name="CreatePin" options={sharedOptions}>
            {props => (
              <Screens.CreatePinScreen {...props} createPin={createPin} />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="ChangePinScreen" options={sharedOptions}>
            {props => <Screens.ChangePinScreen {...props} editPin={editPin} />}
          </RootStack.Screen>
          <RootStack.Screen name="Contacts" options={sharedOptions}>
            {props => (
              <Screens.ContactsNavigationScreen
                {...props}
                {...contactsNavigationScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="EventsScreen"
            component={Screens.EventsScreen}
            options={sharedOptions}
          />
          <RootStack.Screen
            name="SecurityConfigurationScreen"
            options={sharedOptions}>
            {props => (
              <Screens.SecurityConfigurationScreen
                {...props}
                {...securityConfigurationScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="ProfileCreateScreen" options={sharedOptions}>
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
          <RootStack.Screen name="ProfileDetailsScreen" options={sharedOptions}>
            {props => (
              <Screens.ProfileDetailsScreen {...props} profile={profile} />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="FeedbackScreen"
            options={sharedOptions}
            component={Screens.FeedbackScreen}
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
})
