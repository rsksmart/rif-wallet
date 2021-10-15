import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import WalletApp from './App'
import { StyleSheet, View } from 'react-native'

import ReviewTransactionModal from './modal/ReviewTransactionModal'

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
              initialParams={{
                reviewTransaction: (transaction: ReviewTransactionDataI) =>
                  setReviewTransaction(transaction),
              }}
            />
            <RootStack.Screen
              name="SmartWallet"
              component={SmartWallet}
              options={sharedOptions}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>

      {/* Modals: */}
      {context.userInteractionQue.length !== 0 && (
        <ReviewTransactionModal
          closeModal={closeReviewTransactionModal}
          queuedTransactionRequest={context.userInteractionQue[0]}
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
