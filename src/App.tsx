import React, { useContext } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import Button from './components/button'
import { Header1, Header2, Paragraph } from './components/typography'
import { RIFWallet } from './lib/core'
import { WalletProviderContext } from './state/AppContext'
import { removeStorage, StorageKeys } from './storage'
import CopyComponent from './components/copy'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const WalletApp: React.FC<Interface> = ({ navigation }) => {
  const { wallets } = useContext(WalletProviderContext)

  const seeSmartWallet = (account: RIFWallet) =>
    // @ts-ignore
    navigation.navigate('SmartWallet', { account })

  return (
    <ScrollView>
      <Header1>sWallet</Header1>
      <View style={styles.section}>
        <Header2>Welcome</Header2>
        <Button
          onPress={() => navigation.navigate('CreateWalletStack')}
          title="Create master key"
        />
        {wallets.length > 0 && (
          <Button
            onPress={() => navigation.navigate('RevealMasterKey')}
            title="Reveal master key"
          />
        )}
      </View>

      <View style={styles.section}>
        <Header2>RIF Wallets:</Header2>
        {wallets.map((account: RIFWallet, index: number) => {
          return (
            <View key={index}>
              <Paragraph>EOA Address</Paragraph>
              <CopyComponent value={account.smartWallet.wallet.address} />
              <Button
                title="See smart wallet"
                onPress={() => seeSmartWallet(account)}
              />
              <Button
                // @ts-ignore
                onPress={() => navigation.navigate('Receive', { account })}
                title="Receive"
              />
              <Button
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('SendTransaction', {
                    account,
                    token: 'tRIF',
                  })
                }}
                title="Send Transaction"
              />
              <Button
                onPress={() => navigation.navigate('SignMessage', { account })}
                title="Sign Message"
              />
              <Button
                onPress={() =>
                  // @ts-ignore
                  navigation.navigate('Balances', { account })
                }
                title="Balances"
              />
            </View>
          )
        })}
      </View>

      <View style={styles.section}>
        <Header2>Settings</Header2>
        <Button
          onPress={() => {
            removeStorage(StorageKeys.KMS)
          }}
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
