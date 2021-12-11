import React from 'react'
import { Trans } from 'react-i18next'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Button, Header3 } from '../../components'

import { ScreenProps } from './types'

export const BookmarksScreen: React.FC<ScreenProps<'Bookmarks'>> = ({
  navigation,
}) => {
  return (
    <ScrollView>
      <View style={styles.section}>
        <Header3>
          <Trans>Sample apps</Trans>
        </Header3>
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://basic-sample.rlogin.identity.rifos.org/',
            })
          }
          title={'rLogin Sample App'}
        />
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://rsksmart.github.io/rLogin-web3-clients-compatibility-tests/',
            })
          }
          title={'QA Sample App'}
        />
      </View>
      <View style={styles.section}>
        <Header3>
          <Trans>Dapps</Trans>
        </Header3>
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://scheduler.rifos.org/',
            })
          }
          title={'rScheduler App'}
        />
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://testnet.manager.rns.rifos.org',
            })
          }
          title={'RNS App'}
        />
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://sample-app-multisig.rifos.org/',
            })
          }
          title={'Multi-Sig App'}
        />
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://identity.rifos.org/',
            })
          }
          title={'Identity App'}
        />
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://email-verifier.identity.rifos.org/',
            })
          }
          title={'Email Verifier App'}
        />
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://rsksmart.github.io/rBench',
            })
          }
          title={'rBench App'}
        />
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://marketplace.testnet.rifos.org/',
            })
          }
          title={'rMarketplace App'}
        />
      </View>
      <View style={[styles.section, styles.bottomPadding]}>
        <Header3>
          <Trans>Faucets</Trans>
        </Header3>
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://faucet.rifos.org/',
            })
          }
          title={'RIF Faucet App'}
        />
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://rsksmart.github.io/rsk-token-faucet/',
            })
          }
          title={'Tokens Faucet App'}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  bottomPadding: {
    paddingBottom: 30,
  },
})
