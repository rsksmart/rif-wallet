import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import WalletApp from './App'
import { StyleSheet, View } from 'react-native'
import ModalComponent, { ReviewTransactionDataI } from './modal/ModalComponent'
import { TransactionPartial } from './modal/ReviewTransactionComponent'

interface Interface {}

const RootNavigation: React.FC<Interface> = () => {
  const [showModal, setShowModal] = useState<null | ReviewTransactionDataI>(
    null,
  )
  const closeReviewTransactionModal = (
    transaction: TransactionPartial | null,
  ) => {
    console.log(showModal)
    console.log('closeReview...', transaction)
    showModal?.handleConfirm(transaction)
    setShowModal(null)
  }

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
                reviewTransaction: (transaction: ReviewTransactionDataI) =>
                  setShowModal(transaction),
              }}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>

      {/* Modals: */}
      {showModal && (
        <ModalComponent
          closeModal={closeReviewTransactionModal}
          modalVisible={!!showModal}
          transactionData={showModal}
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
