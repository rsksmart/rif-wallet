import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import Button from './components/button'
import { Header1, Header2, Paragraph } from './components/typography'
import { RIFWallet } from './lib/core/src/RIFWallet'

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
    wallet?: RIFWallet
  }

  const [wallet, setWallet] = useState<RIFWallet[]>([])
  const [mnemonic, setMnemonic] = useState<string>('')
  // const [accounts, setAccounts] = useState<Account[]>([])

  const context = useContext(WalletProviderContext)
  useEffect(() => {
    context.wallet && setWallet([context.wallet])
  }, [context.wallet, wallet])

  useEffect(() => {
    setMnemonic(context.getMnemonic())
  }, [])

  /*
  const addAccount = () => {
    if (wallet) {
      wallet
        ?.getAccount(accounts.length)
        .then(account => setAccounts(accounts.concat(account)))
    }
  }
  */

  const seeSmartWallet = (account: RIFWallet) =>
    navigation.navigate('SmartWallet', { account })

  return (
    <ScrollView>
      <Header1>sWallet</Header1>
      <View style={styles.section}>
        <Header2>KMS:</Header2>
        <CopyComponent value={mnemonic} />
      </View>

      <View style={styles.section}>
        <Header2>RIF Wallets:</Header2>
        {wallet.map((account: RIFWallet, index: number) => {
          return (
            <View key={index}>
              <CopyComponent value={account.address} />
              <Button
                title="See smart wallet"
                onPress={() => seeSmartWallet(account)}
              />
              <Button
                onPress={() => navigation.navigate('Receive', { account })}
                title="Receive"
              />
              <Button
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('SendTransaction', { account })
                }}
                title="Send Transaction"
              />
            </View>
          )
        })}
        {/*<Button onPress={addAccount} title="Add account" />*/}
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
