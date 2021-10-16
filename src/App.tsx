import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import Button from './components/button'
import { Header1, Header2, Paragraph } from './components/typography'
import { Account, Wallet } from './lib/core'

import { WalletProviderContext } from './state/AppContext'
import { removeStorage, StorageKeys } from './storage'
import CopyComponent from './components/copy'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const WalletApp: React.FC<Interface> = ({ navigation }) => {
  // Temporary component state:
  interface componentStateI {
    confirmResponse?: string
    wallet?: Wallet
  }

  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
  const [accounts, setAccounts] = useState<Account[]>([])

  const context = useContext(WalletProviderContext)
  useEffect(() => {
    setWallet(context.wallet)
  }, [context.wallet, wallet])

  const addAccount = () => {
    if (wallet) {
      wallet
        ?.getAccount(accounts.length)
        .then(account => setAccounts(accounts.concat(account)))
    }
  }

  const seeSmartWallet = (account: Account) =>
    navigation.navigate('SmartWallet', { account })

  return (
    <ScrollView>
      <Header1>sWallet</Header1>
      <View style={styles.section}>
        <Header2>Wallet:</Header2>
        {wallet && <CopyComponent value={wallet.getMnemonic} />}
      </View>

      <View style={styles.section}>
        <Header2>Accounts:</Header2>
        {accounts.map((account: Account, index: number) => {
          return (
            <View key={index}>
              <CopyComponent value={account.address} />
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
        <Header2>Settings</Header2>
        <Button
          onPress={() => removeStorage(StorageKeys.MNEMONIC)}
          title="Clear RN Storage"
        />
        <Paragraph>
          You will need to refresh the app for this to fully work.
        </Paragraph>
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
