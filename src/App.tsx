import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import Button from './components/button'
import { Header1, Header2, Paragraph } from './components/typography'
import { Wallet } from './lib/core'

import { stateInterface, initialState } from './state'
import { TransactionPartial } from './modal/ReviewTransactionComponent'
import { TextInput } from 'react-native-gesture-handler'

interface Interface {
  navigation: NavigationProp<ParamListBase>
}

const WalletApp: React.FC<Interface> = ({ navigation }) => {
  // App's state:
  const [state, setState] = useState<stateInterface>(initialState)

  // component's functions
  const createWallet = () => {
    state.wallet.createWallet()
    setState({
      ...state,
      mnemonic: state.wallet.getMnemonic(),
    })
  }

  const addAccount = () => {
    const account = state.wallet.getAccount(
      'RSK_TESTNET',
      state.addresses.length,
    )

    setState({
      ...state,
      addresses: state.addresses.concat(account.address),
    })
  }

  const resetState = () => {
    setState({
      ...initialState,
      wallet: new Wallet(),
    })
  }

  /**
   * Temp transaction showing how to pop the review screen:
   */
  const reviewTransaction = () => {
    const transaction: TransactionPartial = {
      to: '0x123456',
      from: '0x987654',
      value: 1000,
    }
    navigation.navigate('ReviewTransaction', {
      transaction,
      onConfirm: transactionConfirmed,
    })
  }

  const transactionConfirmed = (transaction: TransactionPartial) =>
    setState({
      ...state,
      confirmResponse: transaction
        ? 'transaction:' + JSON.stringify(transaction)
        : 'Transaction Cancelled!',
    })

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.screen}>
          <Header1>sWallet</Header1>
          <View style={styles.section}>
            <Button
              onPress={createWallet}
              title="Create RIF Smart Wallet"
              disabled={state.wallet.isSetup}
            />
            <Paragraph>{state.mnemonic}</Paragraph>
          </View>

          <View style={styles.section}>
            <Header2>Accounts:</Header2>
            {state.addresses.map((address: string) => {
              return <Paragraph key={address}>{address}</Paragraph>
            })}
            <Button
              onPress={addAccount}
              title="Add account"
              disabled={!state.wallet.isSetup}
            />
          </View>

          <View style={styles.section}>
            <Button onPress={reviewTransaction} title="Review Transaction" />
            {state.confirmResponse && (
              <Paragraph>{state.confirmResponse}</Paragraph>
            )}
          </View>

          <View style={styles.section}>
            <Button onPress={resetState} title="reset" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeView: {
    height: '100%',
  },
  screen: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  section: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
})

export default WalletApp
