import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import WalletApp from './App'
import SendTransaction from './SendTransaction'
import TransactionReceived from './TransactionReceived'

import { StyleSheet, View } from 'react-native'

import ReviewTransactionModal from './modal/ReviewTransactionModal'
import ReceiveScreen from './screens/receive/ReceiveScreen'

import SmartWallet from './tempScreens/SmartWallet'
import { WalletProviderContext } from './state/AppContext'

interface Interface {}

const RootStack = createStackNavigator()

const RootNavigation: React.FC<Interface> = () => {
  const context = useContext(WalletProviderContext)
  const closeReviewTransactionModal = () => context.resolveUxInteraction()

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
              options={sharedOptions}
            />

            <RootStack.Screen
              name="TransactionReceived"
              component={TransactionReceived}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>

      {/* Modals: */}
      {context.walletRequest && (
        <ReviewTransactionModal
          closeModal={closeReviewTransactionModal}
          queuedTransactionRequest={context.walletRequest}
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
