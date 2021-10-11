import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import Button from './components/button'
import { Header1, Header2, Paragraph } from './components/typography'
import { Account, Wallet } from './lib/core'

import { stateInterface, initialState } from './state'
import { TransactionPartial } from './types/transaction'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const WalletApp: React.FC<Interface> = ({ route }) => {
  // App's state:
  const [state, setState] = useState<stateInterface>(initialState)

  // component's functions
  const createWallet = () => {
    const wallet = Wallet.create()
    setState({
      ...state,
      mnemonic: wallet.getMnemonic,
    })
  }

  const addAccount = () => {
    const account = state.wallet.getAccount(state.accounts.length)
    setState({
      ...state,
      accounts: state.accounts.concat(account),
    })
  }

  const resetState = () => {
    setState(initialState)
  }

  const reviewTransaction = () => {
    const transaction: TransactionPartial = {
      to: '0x123456',
      from: '0x987654',
      value: 1000,
    }
    route.params.reviewTransaction({
      transaction,
      handleConfirm: transactionConfirmed,
    })
  }

  const transactionConfirmed = (transaction: TransactionPartial | null) =>
    setState({
      ...state,
      confirmResponse: transaction
        ? 'transaction:' + JSON.stringify(transaction)
        : 'Transaction Cancelled!',
    })

  return (
    <ScrollView>
      <Header1>sWallet</Header1>
      <View style={styles.section}>
        <Button onPress={createWallet} title="Create RIF Smart Wallet" />
        <Paragraph>{state.mnemonic}</Paragraph>
      </View>

      <View style={styles.section}>
        <Header2>Accounts:</Header2>
        {state.accounts.map((account: Account, index: number) => {
          return <Paragraph key={index}>{account.address}</Paragraph>
        })}
        <Button onPress={addAccount} title="Add account" />
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
    </ScrollView>
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
