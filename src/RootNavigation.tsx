import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { NavigationProp as _NavigationProp } from '@react-navigation/native'

import { CreateKeysNavigation, CreateKeysProps } from './ux/createKeys'

import * as Screens from './screens'
import { InjectSelectedWallet } from './Context'

import { BalancesScreenProps } from './screens/balances/BalancesScreen'
import { KeysInfoScreenProps } from './screens/info/KeysInfoScreen'
import { SendScreenProps } from './screens/send/SendScreen'
import { ActivityScreenProps } from './screens/activity/ActivityScreen'
import { ActivityDetailsScreenProps } from './screens/activity/ActivityDetailsScreen'

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
}

type RootStackParamList = {
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
  activityDetailsScreenProps: ActivityDetailsScreenProps
  keysInfoScreenProps: KeysInfoScreenProps
  sendScreenProps: SendScreenProps
}> = ({
  keyManagementProps,
  balancesScreenProps,
  activityScreenProps,
  keysInfoScreenProps,
  sendScreenProps,
}) => {
  return (
    <View style={styles.parent}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen
            name="Home"
            component={Screens.HomeScreen}
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
            options={sharedOptions}
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
          <RootStack.Screen name="Activity">
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
            options={{ ...sharedOptions, headerShown: false }}
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
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
})
