import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { NavigationProp as _NavigationProp } from '@react-navigation/native'

import { CreateKeysNavigation } from './ux/createKeys'
import { CreateKeysProps } from './ux/createKeys/types'

import * as Screens from './screens'
import { InjectSelectedWallet } from './Context'

const InjectedScreens = Object.keys(Screens).reduce(
  (p, c) =>
    Object.assign(p, { [c]: InjectSelectedWallet((Screens as any)[c]) }),
  {},
) as typeof Screens

type RootStackParamList = {
  Home: undefined
  Send: undefined | { token: string }
  Receive: undefined
  Balances: undefined
  SignMessage: undefined
  SignTypedData: undefined
  TransactionReceived: undefined
  WalletInfo: undefined
  CreateKeysUX: undefined
  KeysInfo: undefined
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
}> = ({ keyManagementProps }) => {
  return (
    <View style={styles.parent}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen
            name="Home"
            component={Screens.HomeScreen}
            options={{ ...sharedOptions, headerShown: false }}
          />
          <RootStack.Screen
            name="Receive"
            component={InjectedScreens.ReceiveScreen}
            options={sharedOptions}
          />
          <RootStack.Screen
            name="Send"
            component={InjectedScreens.SendScreen}
            options={sharedOptions}
          />
          <RootStack.Screen
            name="Balances"
            component={InjectedScreens.BalancesScreen}
          />
          <RootStack.Screen
            name="SignMessage"
            component={InjectedScreens.SignMessageScreen}
            options={sharedOptions}
          />
          <RootStack.Screen
            name="SignTypedData"
            component={Screens.SignTypedDataScreen}
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

          <RootStack.Screen name="CreateKeysUX" options={sharedOptions}>
            {props => (
              <CreateKeysNavigation {...props} {...keyManagementProps} />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="KeysInfo"
            component={Screens.KeysInfoScreen}
            options={sharedOptions}
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
