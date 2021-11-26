import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View, ScrollView, TextInput } from 'react-native'
import { Button, Header2 } from '../../components'

import { ScreenProps } from './types'

export const BookmarksScreen: React.FC<ScreenProps<'Bookmarks'>> = ({
  navigation,
}) => {
  const { t } = useTranslation()

  const [uri, setUri] = useState('')

  return (
    <ScrollView>
      <View style={styles.section}>
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://basic-sample.rlogin.identity.rifos.org/',
            })
          }
          title={'Sample App'}
        />
      </View>
      <View style={styles.section}>
        <Button
          onPress={() =>
            navigation.navigate('InjectedBrowser', {
              uri: 'https://scheduler.rifos.org/',
            })
          }
          title={'Scheduler App'}
        />
      </View>
      <View style={styles.sectionWithBottomLine}>
        <Header2>
          <Trans>Explore</Trans>
        </Header2>
        <TextInput
          onChangeText={text => setUri(text)}
          value={uri}
          placeholder={t('Type the URL')}
          style={styles.input}
        />
        <Button
          onPress={() => {
            navigation.navigate('InjectedBrowser', {
              uri,
            })
            setUri('')
          }}
          disabled={!uri}
          title={t('Navigate')}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  sectionWithBottomLine: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  input: {
    margin: 12,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
  },
})
