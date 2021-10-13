import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import WalletApp from './App'
import { StyleSheet, View } from 'react-native'

import ReviewTransactionModal, {
  ReviewTransactionDataI,
} from './modal/ReviewTransactionModal'
import { Transaction } from '@rsksmart/rlogin-eip1193-types'

import SmartWallet from './tempScreens/SmartWallet'

interface Interface {}

const RootStack = createStackNavigator()

const RootNavigation: React.FC<Interface> = () => {
  const [reviewTransaction, setReviewTransaction] =
    useState<null | ReviewTransactionDataI>(null)
  const closeReviewTransactionModal = (transaction: Transaction | null) => {
    reviewTransaction?.handleConfirm(transaction)
    setReviewTransaction(null)
  }

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
      {reviewTransaction && (
        <ReviewTransactionModal
          closeModal={closeReviewTransactionModal}
          transaction={reviewTransaction.transaction}
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
