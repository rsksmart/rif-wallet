import React, { useContext } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import Button from '../components/button'
import { Header1, Header2, Paragraph } from '../components/typography'
import CopyComponent from '../components/copy'
import { WalletsContext } from '../Context'
import KeysActionItem from './keys/KeysActionItem'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const WalletApp: React.FC<Interface> = ({ navigation }) => {
  const { wallets } = useContext(WalletsContext)

  return (
    <ScrollView>
      <Header1>Welcome to sWallet!</Header1>
      <View style={styles.section}>
        <KeysActionItem navigation={navigation} />
        <View style={styles.section}>
            <Header2>Smart Wallets</Header2>
            {Object.keys(wallets).map((address: string) => {
              const account = wallets[address]
              return (
                <View key={address}>
                  <Paragraph>Smart Wallet Address</Paragraph>
                  <CopyComponent value={account.address} />
                  <View style={styles.subsection}>
                    <Button
                      // @ts-ignore
                      onPress={() => navigation.navigate('Receive')}
                      title="Receive"
                    />
                    <Button
                      onPress={() => {
                        // @ts-ignore
                        navigation.navigate('SendTransaction', { token: 'tRIF' })
                      }}
                      title="Send Transaction"
                    />
                    <Button
                      onPress={() =>
                        // @ts-ignore
                        navigation.navigate('Balances')
                      }
                      title="Balances"
                    />
                  </View>
                  <View style={styles.subsection}>
                  <Button onPress={() =>
                      // @ts-ignore
                      navigation.navigate('SignTypedData')} title="Sign Typed Data" />
                      <Button
                        onPress={() => navigation.navigate('SignMessage')}
                        title="Sign Message"
                      />
                  </View>
                  <View style={styles.subsection}>
                    <Button
                      title="Wallet info"
                      onPress={() => navigation.navigate('SmartWallet')}
                    />
                  </View>
                </View>
              )
            })}
        </View>
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
  subsection: {
    paddingTop: 15,
    paddingBottom: 15,
  }
})

export default WalletApp
