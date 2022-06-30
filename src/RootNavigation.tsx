import React from 'react'
import { StyleSheet, View } from 'react-native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { NavigationProp as _NavigationProp } from '@react-navigation/native'

import { CreateKeysNavigation, CreateKeysProps } from './ux/createKeys'

import * as Screens from './screens'
import { InjectSelectedWallet } from './Context'

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
import { colors } from './styles/colors'
import { SecurityScreenProps } from './screens/security/SecurityConfigurationScreen'

const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
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
  CreatePin: undefined
  InjectedBrowserUX: undefined
  Dapps: undefined
  RNSManager: undefined
  RegisterDomain: { selectedDomain: string; years: number }
  Contacts: undefined
  Settings: undefined
  ManageWallets: undefined
  EventsScreen: undefined
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
  changeTopColor: (color: string) => void
  rifWalletServicesSocket: IRifWalletServicesSocket
  keyManagementProps: CreateKeysProps
  createPin: (newPin: string) => Promise<void>
  editPin: (newPin: string) => Promise<void>
  balancesScreenProps: BalancesScreenProps
  activityScreenProps: ActivityScreenProps
  keysInfoScreenProps: KeysInfoScreenProps
  sendScreenProps: SendScreenProps
  injectedBrowserUXScreenProps: InjectedBrowserUXScreenProps
  contactsNavigationScreenProps: EditContactScreenProps
  dappsScreenProps: DappsScreenScreenProps
  manageWalletScreenProps: ManagerWalletScreenProps
  securityConfiguraitonScreenProps: SecurityScreenProps
}> = ({
  currentScreen,
  hasKeys,
  hasPin,
  changeTopColor,
  keyManagementProps,
  createPin,
  editPin,
  balancesScreenProps,
  activityScreenProps,
  keysInfoScreenProps,
  sendScreenProps,
  injectedBrowserUXScreenProps,
  contactsNavigationScreenProps,
  dappsScreenProps,
  manageWalletScreenProps,
  securityConfiguraitonScreenProps,
}) => {
  let initialRoute: any = 'CreateKeysUX'
  if (hasPin) {
    initialRoute = 'Home'
  } else if (hasKeys) {
    initialRoute = 'CreatePin'
  }

  const appIsSetup = hasKeys && hasPin

  return (
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

        <RootStack.Screen
          name="DevMenu"
          component={Screens.DevMenuScreen}
          options={sharedOptions}
        />

        <RootStack.Screen name="Settings" options={sharedOptions}>
          {props => <Screens.SettingsScreen {...props} />}
        </RootStack.Screen>

        <RootStack.Screen name="ManageWallets" options={sharedOptions}>
          {props => (
            <InjectedScreens.ManageWalletsScreen
              {...props}
              {...manageWalletScreenProps}
            />
          )}
        </RootStack.Screen>

        <RootStack.Screen name="CreateKeysUX" options={sharedOptions}>
          {props => <CreateKeysNavigation {...props} {...keyManagementProps} />}
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
        <RootStack.Screen
          name="ManagePin"
          component={Screens.ManagePinScreen}
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
              {...securityConfiguraitonScreenProps}
            />
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
      {appIsSetup && <AppFooterMenu currentScreen={currentScreen} />}
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
})
