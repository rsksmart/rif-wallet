import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import Button from './components/button'
import { Header1, Header2, Paragraph } from './components/typography'
import { Account, Wallet } from './lib/core'

import { stateInterface, initialState } from './state'

interface Interface {}

const WalletApp: React.FC<Interface> = () => {
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

  return (
    <View>
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
        <Button onPress={resetState} title="reset" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
})

export default WalletApp
