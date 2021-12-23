import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer, NavigationState } from '@react-navigation/native'
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
import { WalletConnectProviderElement } from './screens/walletConnect/WalletConnectContext'

const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  ReceiveScreen: InjectSelectedWallet(Screens.ReceiveScreen),
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
}

type RootStackParamList = {
  DevMenu: undefined
  Home: undefined
  Send: undefined | { token: string }
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
  RegisterDomain: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()
export type NavigationProp = _NavigationProp<RootStackParamList>

const sharedOptions = { headerShown: true }

export type ScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>

export const RootNavigation: React.FC<{
  keyManagementProps: CreateKeysProps
  balancesScreenProps: BalancesScreenProps
  activityScreenProps: ActivityScreenProps
  keysInfoScreenProps: KeysInfoScreenProps
  sendScreenProps: SendScreenProps
  injectedBrowserUXScreenProps: InjectedBrowserUXScreenProps
}> = ({
  keyManagementProps,
  balancesScreenProps,
  activityScreenProps,
  keysInfoScreenProps,
  sendScreenProps,
  injectedBrowserUXScreenProps,
}) => {
  const [currentScreen, setCurrentScreen] = useState<string>('Home')
  const handleScreenChange = (newState: NavigationState | undefined) =>
    setCurrentScreen(
      newState ? newState.routes[newState.routes.length - 1].name : 'Home',
    )

  return (
    <View style={styles.parent}>
      <NavigationContainer onStateChange={handleScreenChange}>
        <WalletConnectProviderElement>
          <AppHeader />
          <RootStack.Navigator>
            <RootStack.Screen
              name="Home"
              component={Screens.HomeScreen}
              options={{ ...sharedOptions, headerShown: false }}
            />
            <RootStack.Screen
              name="Dapps"
              component={Screens.DappsScreen}
              options={{ ...sharedOptions, headerShown: false }}
            />

            <RootStack.Screen
              name="DevMenu"
              component={Screens.DevMenuScreen}
              options={{ ...sharedOptions, headerShown: false }}
            />

            <RootStack.Screen name="CreateKeysUX" options={sharedOptions}>
              {props => (
                <CreateKeysNavigation {...props} {...keyManagementProps} />
              )}
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
              options={{ ...sharedOptions }}
            />
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
          <AppFooterMenu currentScreen={currentScreen} />
        </WalletConnectProviderElement>
      </NavigationContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
})
