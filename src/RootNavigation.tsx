import React from 'react'
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { NavigationProp as _NavigationProp } from '@react-navigation/native'

import { CreateKeysNavigation, CreateKeysProps } from './screens/createKeys'

/* JESSE!!!! cleanup this list: */
import * as Screens from './screens'
import { InjectSelectedWallet } from './Context'
import { BalancesScreenProps } from './screens/balances/BalancesScreen'
import { ShowMnemonicScreenProps } from './screens/info/ShowMnemonicScreen'
import { SendScreenProps } from './screens/send/SendScreen'
import { ActivityScreenProps } from './screens/activity/ActivityScreen'
import { InjectedBrowserUXScreenProps } from './screens/injectedBrowser/InjectedBrowserNavigation'
import { AppHeader } from './ux/appHeader'
import { AppFooterMenu } from './ux/appFooter'
import { EditContactScreenProps } from './screens/contacts/EditContactScreen'
import { DappsScreenScreenProps } from './screens/dapps'
import { IRifWalletServicesSocket } from './lib/rifWalletServices/RifWalletServicesSocket'
import { colors } from './styles'
import { AccountsScreenType } from './screens/accounts/AccountsScreen'
import { SecurityScreenProps } from './screens/security/SecurityConfigurationScreen'

const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  BalancesScreen: InjectSelectedWallet(Screens.BalancesScreen),
  ActivityScreen: InjectSelectedWallet(Screens.ActivityScreen),
  ActivityDetailsScreen: InjectSelectedWallet(Screens.ActivityDetailsScreen),
  ManuallyDeployScreen: InjectSelectedWallet(Screens.ManuallyDeployScreen),
  WalletConnectNavigationScreen: InjectSelectedWallet(
    Screens.WalletConnectNavigationScreen,
  ),
  InjectedBrowserNavigation: InjectSelectedWallet(
    Screens.InjectedBrowserNavigation,
  ),
  RNSManagerScreen: InjectSelectedWallet(Screens.RNSManagerScreen),
  RegisterDomainScreen: InjectSelectedWallet(Screens.RegisterDomainScreen),
  HomeScreen: InjectSelectedWallet(Screens.HomeScreen),
  DappsScreen: InjectSelectedWallet(Screens.DappsScreen),
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
  Balances: undefined
  Activity: undefined
  ActivityDetails: undefined
  SignMessage: undefined
  SignTypedData: undefined
  TransactionReceived: undefined
  ManuallyDeployScreen: undefined
  CreateKeysUX: undefined
  ShowMnemonicScreen: undefined
  WalletConnect: undefined
  ChangeLanguage: undefined
  ManagePin: undefined
  CreatePin: undefined
  InjectedBrowserUX: undefined
  Dapps: undefined
  RNSManager: undefined
  RegisterDomain: { selectedDomain: string; years: number }
  Contacts: undefined
  Settings: undefined
  EventsScreen: undefined
  AccountsScreen: undefined
  SecurityConfigurationScreen: undefined
  ChangePinScreen: undefined
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
  rifWalletServicesSocket: IRifWalletServicesSocket
  keyManagementProps: CreateKeysProps
  createPin: (newPin: string) => Promise<void>
  editPin: (newPin: string) => Promise<void>
  balancesScreenProps: BalancesScreenProps
  activityScreenProps: ActivityScreenProps
  showMnemonicScreenProps: ShowMnemonicScreenProps
  sendScreenProps: SendScreenProps
  injectedBrowserUXScreenProps: InjectedBrowserUXScreenProps
  contactsNavigationScreenProps: EditContactScreenProps
  dappsScreenProps: DappsScreenScreenProps
  accountsScreenType: AccountsScreenType
  securityConfigurationScreenProps: SecurityScreenProps
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
  injectedBrowserUXScreenProps,
  contactsNavigationScreenProps,
  dappsScreenProps,
  accountsScreenType,
  securityConfigurationScreenProps,
}) => {
  let initialRoute: any = 'CreateKeysUX'
  if (hasPin) {
    initialRoute = 'Home'
  } else if (hasKeys) {
    initialRoute = 'CreatePin'
  }

  const appIsSetup = hasKeys && hasPin

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.parent}>
        {appIsSetup && <AppHeader />}
        <RootStack.Navigator initialRouteName={initialRoute}>
          <RootStack.Screen name="Home" options={sharedOptions}>
            {props => (
              <InjectedScreens.HomeScreen
                {...props}
                changeTopColor={changeTopColor}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="Dapps" options={sharedOptions}>
            {props => (
              <InjectedScreens.DappsScreen {...props} {...dappsScreenProps} />
            )}
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

          <RootStack.Screen
            name="ManuallyDeployScreen"
            component={InjectedScreens.ManuallyDeployScreen}
            options={sharedOptions}
          />
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

          <RootStack.Screen
            name="WalletConnect"
            component={InjectedScreens.WalletConnectNavigationScreen}
            options={sharedOptions}
          />
          <RootStack.Screen
            name="RNSManager"
            component={InjectedScreens.RNSManagerScreen}
            options={sharedOptions}
          />
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
          <RootStack.Screen name="InjectedBrowserUX" options={sharedOptions}>
            {props => (
              <InjectedScreens.InjectedBrowserNavigation
                {...props}
                {...injectedBrowserUXScreenProps}
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
        </RootStack.Navigator>
        {appIsSetup && !isKeyboardVisible && (
          <AppFooterMenu currentScreen={currentScreen} />
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
})
