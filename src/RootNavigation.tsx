import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { WalletProviderContext } from './state/AppContext'
import ModalComponent from './modal/ModalComponent'

import Landing from './screens/Landing'
import CreateWalletNavigationScreen from './screens/createWallet'
import SendTransaction from './screens/send/SendTransaction'
import ReceiveScreen from './screens/receive/ReceiveScreen'
import BalancesScreen from './screens/balances/BalancesScreen'
import SignMessageScreen from './tempScreens/SignMessageScreen'
import RevealMasterKeyScreen from './screens/createWallet/RevealMasterKeyScreen'
import TransactionReceived from './screens/TransactionReceived'

import SmartWallet from './tempScreens/SmartWallet'
import { Requests, SWalletContext, useSelectedWallet } from './Context'
import { RIFWallet } from './lib/core'

const RootStack = createStackNavigator()

const RootNavigation: React.FC = () => {
  const { requests, setRequests } = useContext(SWalletContext)
  const closeRequest = () => setRequests([] as Requests)
  const wallet = useSelectedWallet()

  const sharedOptions = { headerShown: false }
  return (
    <View style={styles.parent}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen
              name="Home"
              component={Landing}
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
            <RootStack.Screen
              name="CreateWalletStack"
              component={CreateWalletNavigationScreen}
              options={sharedOptions}
            />
            <RootStack.Screen
              name="RevealMasterKey"
              component={RevealMasterKeyScreen}
              options={{ ...sharedOptions, headerShown: true }}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>

      {/* Modals: */}
      {requests.length !== 0 && (
        <ModalComponent
          closeModal={closeRequest}
          request={requests[0]}
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
