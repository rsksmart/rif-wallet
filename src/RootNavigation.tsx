import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Landing from './screens/Home'
import CreateWalletNavigationScreen from './screens/keys'
import SendTransaction from './screens/send/SendTransaction'
import ReceiveScreen from './screens/receive/ReceiveScreen'
import BalancesScreen from './screens/balances/BalancesScreen'
import SignMessageScreen from './screens/signatures/SignMessageScreen'
import RevealMasterKeyScreen from './screens/keys/RevealMasterKeyScreen'
import TransactionReceived from './screens/TransactionReceived'

import SmartWallet from './screens/WalletInfo'
import SignTypedDataScreen from './screens/signatures/SignTypedDataScreen'

const RootStack = createStackNavigator()

const sharedOptions = { headerShown: true }

const RootNavigation: React.FC = () => {
  return (
    <View style={styles.parent}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen name="Home" component={Landing} />
            <RootStack.Screen name="CreateWalletStack" component={CreateWalletNavigationScreen} options={sharedOptions} />
            <RootStack.Screen name="SmartWallet" component={SmartWallet} options={sharedOptions} />
            <RootStack.Screen name="Receive" component={ReceiveScreen} options={sharedOptions} />
            <RootStack.Screen name="SendTransaction" component={SendTransaction} options={sharedOptions} />
            <RootStack.Screen name="Balances" component={BalancesScreen} />
            <RootStack.Screen name="SignMessage" component={SignMessageScreen} options={sharedOptions} />
            <RootStack.Screen name="SignTypedData" component={SignTypedDataScreen} options={sharedOptions} />
            <RootStack.Screen name="TransactionReceived" component={TransactionReceived} options={sharedOptions} />
          </RootStack.Group>
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

export default RootNavigation
