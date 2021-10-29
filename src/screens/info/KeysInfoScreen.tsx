import React, { useContext } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import { deleteKeys } from '../../storage/KeyStore'

import { AppContext } from '../../Context'
import { Button, CopyComponent, Header2, Paragraph } from '../../components'

export const KeysInfoScreen = () => (
  <ScrollView>
    <View style={styles.sectionCentered}>
      <Paragraph>
        With your master key (seed phrase) you are able to create as many
        wallets as you need.
      </Paragraph>
    </View>
    <View style={styles.section}>
      <Header2>Master key</Header2>
      <CopyComponent value={useContext(AppContext).mnemonic || ''} />
    </View>
    <View style={styles.section}>
      <Button onPress={deleteKeys} title="Delete keys" />
      <Paragraph>
        You will need to refresh the app for this to fully work.
      </Paragraph>
    </View>
  </ScrollView>
)

const styles = StyleSheet.create({
  section: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  sectionCentered: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
})
