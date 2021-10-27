import { NavigationProp, ParamListBase } from '@react-navigation/core'
import React, { useContext } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import Button from '../../components/button'
import { Header2, Paragraph } from '../../components/typography'
import CopyComponent from '../../components/copy'
import { KeyManagementContext } from '../../Context'
import { deleteKeys } from '../../storage/KeyStore'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const RevealMasterKeyScreen: React.FC<Interface> = () => {
  const { mnemonic } = useContext(KeyManagementContext)

  return (
    <ScrollView>
      <View style={styles.sectionCentered}>
        <Paragraph>
          With your master key (seed phrase) you are able to create as many
          wallets as you need.
        </Paragraph>
      </View>
      <View style={styles.section}>
        <Header2>Master key</Header2>
        <CopyComponent value={mnemonic || ''} />
      </View>
      <View style={styles.section}>
        <Button
          onPress={deleteKeys}
          title="Delete keys"
        />
        <Paragraph>
          You will need to refresh the app for this to fully work.
        </Paragraph>
      </View>
    </ScrollView>
  )
}

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

export default RevealMasterKeyScreen
