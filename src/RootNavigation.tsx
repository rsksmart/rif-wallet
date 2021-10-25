import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import WalletApp from './App'
import SendTransaction from './screens/send/SendTransaction'
import TransactionReceived from './TransactionReceived'

import { StyleSheet, View } from 'react-native'

import ReceiveScreen from './screens/receive/ReceiveScreen'

import SmartWallet from './tempScreens/SmartWallet'
import { WalletProviderContext } from './state/AppContext'
import ModalComponent from './modal/ModalComponent'
import SignMessageScreen from './tempScreens/SignMessageScreen'
import BalancesScreen from './screens/balances/BalancesScreen'

interface Interface {}

const RootStack = createStackNavigator()

const RootNavigation: React.FC<Interface> = () => {
  const context = useContext(WalletProviderContext)
  const closeRequest = () => context.resolveUxInteraction()

  const sharedOptions = { headerShown: false }
  return (
    <View style={styles.parent}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen
              name="Home"
              component={WalletApp}
              options={sharedOptions}
            />

            <RootStack.Screen
              name="SmartWallet"
              component={SmartWallet}
              options={sharedOptions}
            />
            <RootStack.Screen
              name="Receive"
              component={ReceiveScreen}
              options={sharedOptions}
            />
            <RootStack.Screen
              name="SendTransaction"
              component={SendTransaction}
            />
            <RootStack.Screen
              name="TransactionReceived"
              component={TransactionReceived}
            />
            <RootStack.Screen
              name="SignMessage"
              component={SignMessageScreen}
              options={sharedOptions}
            />
            <RootStack.Screen name="Balances" component={BalancesScreen} />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>

      {/* Modals: */}
      {context.walletRequests.length !== 0 && (
        <ModalComponent
          closeModal={closeRequest}
          request={context.walletRequests[0]}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
})

export default RootNavigation
