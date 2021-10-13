import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import Button from './components/button'
import { Header1, Header2, Paragraph } from './components/typography'
import { Account, Wallet } from './lib/core'

import { Transaction } from '@rsksmart/rlogin-eip1193-types'
import { WalletProviderContext } from './state/AppContext'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const WalletApp: React.FC<Interface> = ({ route, navigation }) => {
  // Temporary component state:
  interface componentStateI {
    confirmResponse?: string
    wallet?: Wallet
  }
  const [componentState, setComponentState] = useState<componentStateI>({
    confirmResponse: undefined,
  })

  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
  const [accounts, setAccounts] = useState<Account[]>([])

  const context = useContext(WalletProviderContext)
  useEffect(() => {
    setWallet(context.wallet)
  }, [context.wallet, wallet])

  const addAccount = () => {
    wallet && setAccounts(accounts.concat(wallet?.getAccount(accounts.length)))
  }

  const seeSmartWallet = (account: Account) =>
    navigation.navigate('SmartWallet', { account })

  const reviewTransaction = () => {
    // to/from/value/data should be provided by the user and gases should be estimated
    const transaction: Transaction = {
      to: '0x123456',
      from: '0x987654',
      value: 1000,
      gasLimit: 10000,
      gasPrice: 0.067,
    }

    route.params.reviewTransaction({
      transaction,
      handleConfirm: transactionConfirmed,
    })
  }

  const transactionConfirmed = (transaction: Transaction | null) =>
    setComponentState({
      ...componentState,
      confirmResponse: transaction
        ? 'transaction:' + JSON.stringify(transaction)
        : 'Transaction Cancelled!',
    })

  return (
    <ScrollView>
      <Header1>sWallet</Header1>
      <View style={styles.section}>
        <Header2>Wallet:</Header2>
        <Paragraph>{wallet?.getMnemonic}</Paragraph>
      </View>

      <View style={styles.section}>
        <Header2>Accounts:</Header2>
        {accounts.map((account: Account, index: number) => {
          return (
            <View key={index}>
              <Paragraph>{account.address}</Paragraph>
              <Button
                title="See smart wallet"
                onPress={() => seeSmartWallet(account)}
              />
            </View>
          )
        })}
        <Button onPress={addAccount} title="Add account" />
      </View>

      <View style={styles.section}>
        <Button onPress={reviewTransaction} title="Review Transaction" />
        {componentState.confirmResponse && (
          <Paragraph>{componentState.confirmResponse}</Paragraph>
        )}
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
