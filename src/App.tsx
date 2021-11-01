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
  const { wallets, addUxInteraction } = useContext(WalletProviderContext)
  // TEMP - Add a request to the que WITHOUT going through the wallet!
  const signedTypedData = () => {
    const typedDataRequest = {
      domain: {
        chainId: 31,
        name: 'rLogin sample app',
        verifyingContract: '0x285b30492a3f444d7bf75261a35cb292fc8f41a6',
        version: '1',
      },
      message: {
        contents: 'Welcome to rLogin!',
        num: 1500,
        person: {
          firstName: 'jesse',
          lastName: 'clark',
        },
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Sample',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition
        Sample: [
          { name: 'contents', type: 'string' },
          { name: 'num', type: 'uint256' },
          { name: 'person', type: 'Person' },
        ],
        Person: [
          { name: 'firstName', type: 'string' },
          { name: 'lastName', type: 'string' },
        ],
      },
    }

    const request = {
      type: 'signTypedData',
      payload: typedDataRequest,
      confirm: () => console.log('CONFIRMED!'),
      reject: () => console.log('REJECTED!'),
    }

    // @ts-ignore
    addUxInteraction(request)
  }

  const seeSmartWallet = (account: RIFWallet) =>
    // @ts-ignore
    navigation.navigate('SmartWallet', { account })

  return (
    <ScrollView>
      <Header1>sWallet</Header1>
      <View style={styles.section}>
        <Header2>Welcome</Header2>
        {wallets.length > 0 ? (
          <Button
            onPress={() => navigation.navigate('RevealMasterKey')}
            title="Reveal master key"
          />
        ) : (
          <Button
            onPress={() => navigation.navigate('CreateWalletStack')}
            title="Create master key"
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
              <Button onPress={signedTypedData} title="Sign Typed Data" />

              <Button
                onPress={() =>
                  // @ts-ignore
                  navigation.navigate('Activity', { account })
                }
                title="Activity"
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
