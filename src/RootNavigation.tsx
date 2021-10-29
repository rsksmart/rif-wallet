import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import { NavigationProp as _NavigationProp } from '@react-navigation/native'

import Landing from './screens/Home'
import CreateKeysUX from './ux/createKeys'
import { KeyManagementProps } from './ux/createKeys/types'
import SendTransaction from './screens/send/SendTransaction'
import ReceiveScreen from './screens/receive/ReceiveScreen'
import BalancesScreen from './screens/balances/BalancesScreen'
import SignMessageScreen from './screens/signatures/SignMessageScreen'
import TransactionReceived from './screens/TransactionReceived'
import KeysInfoScreen from './screens/info/KeysInfo'
import WalletInfoScreen from './screens/info/WalletInfo'

import SignTypedDataScreen from './screens/signatures/SignTypedDataScreen'

type RootStackParamList = {
  Home: undefined
  Send: undefined | { token: string }
  Receive: undefined
  Balances: undefined
  SignMessage: undefined
  SignTypedData: undefined
  TransactionReceived: undefined
  WalletInfo: undefined
  CreateKeys: undefined
  KeysInfo: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()
export type NavigationProp = _NavigationProp<RootStackParamList>

const sharedOptions = { headerShown: true }

export type ScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

export const RootNavigation: React.FC<{ keyManagementProps: KeyManagementProps }> = ({ keyManagementProps }) => {
  return (
    <View style={styles.parent}>
      <NavigationContainer>
        <RootStack.Navigator>
            <RootStack.Screen name="Home" component={Landing} options={{ ...sharedOptions, headerShown: false }} />
            <RootStack.Screen name="Receive" component={ReceiveScreen} options={sharedOptions} />
            <RootStack.Screen name="Send" component={SendTransaction} options={sharedOptions} />
            <RootStack.Screen name="Balances" component={BalancesScreen} />
            <RootStack.Screen name="SignMessage" component={SignMessageScreen} options={sharedOptions} />
            <RootStack.Screen name="SignTypedData" component={SignTypedDataScreen} options={sharedOptions} />
            <RootStack.Screen name="TransactionReceived" component={TransactionReceived} options={sharedOptions} />
            <RootStack.Screen name="WalletInfo" component={WalletInfoScreen} options={sharedOptions} />

            <RootStack.Screen name="CreateKeys" options={sharedOptions}>
              {props => <CreateKeysUX {...props} {...keyManagementProps} />}
            </RootStack.Screen>
            <RootStack.Screen name="KeysInfo" component={KeysInfoScreen} options={sharedOptions} />
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

