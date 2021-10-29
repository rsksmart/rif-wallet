import React, { useContext } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import Button from '../components/button'
import { Header1, Header2, Paragraph } from '../components/typography'
import CopyComponent from '../components/copy'
import { AppContext } from '../Context'
import { NavigationProp } from '../RootNavigation'
import { ScreenProps } from '../RootNavigation'
import { RIFWallet } from '../lib/core'
import { Wallet } from '@ethersproject/wallet'
import { Signer } from '@ethersproject/abstract-signer'

const KeysActionItem = ({ navigation }: { navigation: NavigationProp }) => !useContext(AppContext).mnemonic ? <Button
  onPress={() => navigation.navigate('CreateKeys')}
  title="Create master key"
/> : <Button
  onPress={() => navigation.navigate('KeysInfo')}
  title="Reveal master key"
/>

const WalletRow = ({ address, navigation }: { address: string, navigation: NavigationProp }) => <View>
<Paragraph>Smart Wallet Address</Paragraph>
  <CopyComponent value={address} />
  <View style={styles.subsection}>
    <Button
      onPress={() => navigation.navigate('Receive')}
      title="Receive"
    />
    <Button
      onPress={() => {
        navigation.navigate('Send', { token: 'tRIF' })
      }}
      title="Send Transaction"
    />
    <Button
      onPress={() =>
        navigation.navigate('Balances')
      }
      title="Balances"
    />
  </View>
  <View style={styles.subsection}>
      <Button
        onPress={() => navigation.navigate('SignMessage')}
        title="Sign Message"
      />
  <Button onPress={() =>
      navigation.navigate('SignTypedData')} title="Sign Typed Data" />
  </View>
  <View style={styles.subsection}>
    <Button
      title="Wallet info"
      onPress={() => navigation.navigate('WalletInfo')}
    />
  </View>
</View>

const WalletApp: React.FC<ScreenProps<'Home'>> = ({ navigation }) => {
  const { wallets } = useContext(AppContext)

  return (
    <ScrollView style={styles.section}>
      <Header1>Welcome to sWallet!</Header1>
      <KeysActionItem navigation={navigation} />
      {Object.keys(wallets).map((address: string) => <WalletRow address={address} navigation={navigation} />)}
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
