import React from 'react'
import { StyleSheet, View } from 'react-native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { NavigationProp as _NavigationProp } from '@react-navigation/native'

import { CreateKeysNavigation, CreateKeysProps } from './ux/createKeys'

import * as Screens from './screens'
import { InjectSelectedWallet } from './Context'
//import { ReceiveScreenWithDomains } from './screens/receive/ReceiveScreenWithDomains'

import { BalancesScreenProps } from './screens/balances/BalancesScreen'
import { KeysInfoScreenProps } from './screens/info/KeysInfoScreen'
import { SendScreenProps } from './screens/send/SendScreen'
import { ActivityScreenProps } from './screens/activity/ActivityScreen'
import { InjectedBrowserUXScreenProps } from './screens/injectedBrowser/InjectedBrowserNavigation'
import { AppHeader } from './ux/appHeader'
import { AppFooterMenu } from './ux/appFooter'
import { EditContactScreenProps } from './screens/contacts/EditContactScreen'
import { DappsScreenScreenProps } from './screens/dapps'
import { IRifWalletServicesSocket } from './lib/rifWalletServices/RifWalletServicesSocket'
import { ManagerWalletScreenProps } from './screens/settings/ManageWalletsScreen'

const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  ReceiveScreen: InjectSelectedWallet(Screens.ReceiveScreenWithDomains),
  BalancesScreen: InjectSelectedWallet(Screens.BalancesScreen),
  ActivityScreen: InjectSelectedWallet(Screens.ActivityScreen),
  ActivityDetailsScreen: InjectSelectedWallet(Screens.ActivityDetailsScreen),
  SignMessageScreen: InjectSelectedWallet(Screens.SignMessageScreen),
  WalletInfoScreen: InjectSelectedWallet(Screens.WalletInfoScreen),
  KeysInfoScreen: InjectSelectedWallet(Screens.KeysInfoScreen),
  SignTypedDataScreen: InjectSelectedWallet(Screens.SignTypedDataScreen),
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
  ManageWalletsScreen: InjectSelectedWallet(Screens.ManageWalletsScreen),
}

type RootStackParamList = {
  DevMenu: undefined
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
  WalletInfo: undefined
  CreateKeysUX: undefined
  KeysInfo: undefined
  WalletConnect: undefined
  ChangeLanguage: undefined
  ManagePin: undefined
  InjectedBrowserUX: undefined
  Dapps: undefined
  RNSManager: undefined
  RegisterDomain: { selectedDomain: string; years: number }
  Contacts: undefined
  Settings: undefined
  ManageWallets: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()
export type NavigationProp = _NavigationProp<RootStackParamList>

const sharedOptions = { headerShown: true }

export type ScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>

export const RootNavigation: React.FC<{
  currentScreen: string
  hasKeys: boolean
  rifWalletServicesSocket: IRifWalletServicesSocket
  keyManagementProps: CreateKeysProps
  balancesScreenProps: BalancesScreenProps
  activityScreenProps: ActivityScreenProps
  keysInfoScreenProps: KeysInfoScreenProps
  sendScreenProps: SendScreenProps
  injectedBrowserUXScreenProps: InjectedBrowserUXScreenProps
  contactsNavigationScreenProps: EditContactScreenProps
  dappsScreenProps: DappsScreenScreenProps
  manageWalletScreenProps: ManagerWalletScreenProps
}> = ({
  currentScreen,
  hasKeys,
  keyManagementProps,
  balancesScreenProps,
  activityScreenProps,
  keysInfoScreenProps,
  sendScreenProps,
  injectedBrowserUXScreenProps,
  contactsNavigationScreenProps,
  dappsScreenProps,
  manageWalletScreenProps,
}) => {
  return (
    <View style={styles.parent}>
      {hasKeys && <AppHeader />}
      <RootStack.Navigator initialRouteName={hasKeys ? 'Home' : 'CreateKeysUX'}>
        <RootStack.Screen
          name="Home"
          component={Screens.HomeScreen}
          options={{ ...sharedOptions, headerShown: false }}
        />
        <RootStack.Screen
          name="Dapps"
          options={{ ...sharedOptions, headerShown: false }}>
          {props => (
            <InjectedScreens.DappsScreen {...props} {...dappsScreenProps} />
          )}
        </RootStack.Screen>

        <RootStack.Screen
          name="DevMenu"
          component={Screens.DevMenuScreen}
          options={{ ...sharedOptions, headerShown: false }}
        />

        <RootStack.Screen
          name="Settings"
          component={Screens.SettingsScreen}
          options={{ ...sharedOptions, headerShown: false }}
        />

        <RootStack.Screen name="ManageWallets" options={{ headerShown: true }}>
          {props => (
            <InjectedScreens.ManageWalletsScreen
              {...props}
              {...manageWalletScreenProps}
            />
          )}
        </RootStack.Screen>

        <RootStack.Screen
          name="CreateKeysUX"
          options={{ ...sharedOptions, headerShown: false }}>
          {props => <CreateKeysNavigation {...props} {...keyManagementProps} />}
        </RootStack.Screen>
        <RootStack.Screen
          name="Receive"
          component={InjectedScreens.ReceiveScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="Send">
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
        <RootStack.Screen name="Activity" options={{ headerShown: false }}>
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
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="SignMessage"
          component={InjectedScreens.SignMessageScreen}
          options={sharedOptions}
        />
        <RootStack.Screen
          name="SignTypedData"
          component={InjectedScreens.SignTypedDataScreen}
          options={sharedOptions}
        />

        <RootStack.Screen
          name="TransactionReceived"
          component={Screens.TransactionReceivedScreen}
          options={sharedOptions}
        />

        <RootStack.Screen
          name="WalletInfo"
          component={InjectedScreens.WalletInfoScreen}
          options={sharedOptions}
        />
        <RootStack.Screen name="KeysInfo" options={sharedOptions}>
          {props => (
            <Screens.KeysInfoScreen {...props} {...keysInfoScreenProps} />
          )}
        </RootStack.Screen>

        <RootStack.Screen
          name="WalletConnect"
          component={InjectedScreens.WalletConnectNavigationScreen}
          options={{ ...sharedOptions, headerShown: false }}
        />
        <RootStack.Screen
          name="RNSManager"
          component={InjectedScreens.RNSManagerScreen}
          options={{ ...sharedOptions }}
        />
        <RootStack.Screen
          name="RegisterDomain"
          component={InjectedScreens.RegisterDomainScreen}
          options={{ ...sharedOptions }}
        />
        <RootStack.Screen
          name="ChangeLanguage"
          component={Screens.ChangeLanguageScreen}
          options={{ ...sharedOptions }}
        />
        <RootStack.Screen
          name="ManagePin"
          component={Screens.ManagePinScreen}
          options={{ ...sharedOptions, headerShown: false }}
        />

        <RootStack.Screen
          name="Contacts"
          options={{ ...sharedOptions, headerShown: false }}>
          {props => (
            <Screens.ContactsNavigationScreen
              {...props}
              {...contactsNavigationScreenProps}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="InjectedBrowserUX"
          options={{ ...sharedOptions, headerShown: false }}>
          {props => (
            <InjectedScreens.InjectedBrowserNavigation
              {...props}
              {...injectedBrowserUXScreenProps}
            />
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
      {hasKeys && <AppFooterMenu currentScreen={currentScreen} />}
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
})
