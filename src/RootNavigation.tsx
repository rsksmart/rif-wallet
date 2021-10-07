import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import WalletApp from './App'
import { LogBox, StyleSheet, View } from 'react-native'
import ModalComponent from './modal/ModalComponent'
import { TransactionPartial } from './modal/ReviewTransactionComponent'

// "If you don't use state persistence or deep link to the screen which accepts functions in params, then the warning doesn't affect you and you can safely ignore it."
// ref: https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

interface Interface {}

const RootNavigation: React.FC<Interface> = () => {
  const [showModal, setShowModal] = useState<null | TransactionPartial>(null)
  const RootStack = createStackNavigator()
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
                reviewTransaction: (transaction: TransactionPartial) =>
                  setShowModal(transaction),
              }}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>

      {/* Modals: */}
      <ModalComponent
        closeModal={() => setShowModal(null)}
        modalVisible={!!showModal}
        transaction={showModal}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
})

export default RootNavigation
