import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useTranslation, Trans } from 'react-i18next'

import { Address, Button, Header1, Paragraph } from '../components'
import { AppContext } from '../Context'
import { NavigationProp } from '../RootNavigation'
import { ScreenProps } from '../RootNavigation'
import { RIFWallet } from '../lib/core'

const KeysActionItem = ({
  navigation,
  t,
}: {
  navigation: NavigationProp
  t: any
}) =>
  !useContext(AppContext).mnemonic ? (
    <Button
      onPress={() => navigation.navigate('CreateKeysUX')}
      title={t('Create master key')}
    />
  ) : (
    <Button
      onPress={() => navigation.navigate('KeysInfo')}
      title={t('Reveal master key')}
    />
  )

const WalletRow = ({
  wallet,
  navigation,
  t,
}: {
  wallet: RIFWallet
  navigation: NavigationProp
  t: any
}) => {
  const [isDeployed, setIsDeployed] = useState(false)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      wallet.smartWalletFactory.isDeployed().then(setIsDeployed)
    })
    return unsubscribe
  }, [])

  return (
    <>
      <Paragraph>Smart Wallet Address</Paragraph>

      <Address>{wallet.smartWalletAddress}</Address>
      <Paragraph>Is deployed: {isDeployed ? 'Yes' : 'No'}</Paragraph>

      <View style={styles.subsection}>
        <Button
          onPress={() => navigation.navigate('Receive')}
          title={t('Receive')}
        />
        <Button
          onPress={() => {
            navigation.navigate('Send', { token: 'tRIF' })
          }}
          title={t('Send Transaction')}
          disabled={!isDeployed}
        />
        <Button
          onPress={() => navigation.navigate('Balances')}
          title={t('Balances')}
        />
        <Button
          onPress={() => navigation.navigate('Activity')}
          title={t('Activity')}
        />
      </View>

      <View style={styles.subsection}>
        <Button
          onPress={() => navigation.navigate('SignMessage')}
          title={t('Sign Message')}
          disabled={!isDeployed}
        />
        <Button
          onPress={() => navigation.navigate('SignTypedData')}
          title={t('Sign Typed Data')}
          disabled={!isDeployed}
        />
      </View>

      <View style={styles.subsection}>
        <Button
          title={t('Wallet info')}
          onPress={() => navigation.navigate('WalletInfo')}
        />
      </View>
      <View style={styles.subsection}>
        <Button
          onPress={() => navigation.navigate('WalletConnect')}
          title={t('WalletConnect')}
          disabled={!isDeployed}
        />
      </View>
      <View style={styles.subsection}>
        <Button
          onPress={() => navigation.navigate('ChangeLanguage')}
          title={t('Change Language')}
        />
        <Button
          onPress={() => navigation.navigate('ManagePin')}
          title={t('Manage Pin')}
        />
      </View>
    </>
  )
}

export const HomeScreen: React.FC<ScreenProps<'Home'>> = ({ navigation }) => {
  const { wallets } = useContext(AppContext)
  const { t } = useTranslation()

  return (
    <ScrollView style={styles.section}>
      <Header1>
        <Trans>Welcome to sWallet!</Trans>
      </Header1>
      <KeysActionItem navigation={navigation} t={t} />
      {Object.keys(wallets).map((address: string) => (
        <WalletRow
          key={address}
          wallet={wallets[address]}
          navigation={navigation}
          t={t}
        />
      ))}
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
  },
})
