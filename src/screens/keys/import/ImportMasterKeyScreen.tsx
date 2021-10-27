import { NavigationProp, ParamListBase } from '@react-navigation/core'
import React, { useState, useContext } from 'react'
import { StyleSheet, View, ScrollView, TextInput } from 'react-native'

import { Header2, Paragraph } from '../../../components/typography'

import Button from '../../../components/button'
import { KeyManagementContext } from '../../../Context'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const ImportMasterKeyScreen: React.FC<Interface> = ({ navigation }) => {
  const { createFirstWallet } = useContext(KeyManagementContext)
  const [importMnemonic, setImportMnemonic] = useState<string | undefined>()

  const [error, setError] = useState<string | null>(null)

  const handleImportMnemonic = async () => {
    // TODO: how many words should have the mnemonic?
    const isValid = importMnemonic && importMnemonic.split(' ').length > 12

    if (!isValid) {
      setError('you need to enter your twelve words master key')
      return
    }

    try {
      await createFirstWallet(importMnemonic)
      navigation.navigate('WalletCreated', { mnemonic: importMnemonic })
    } catch (err) {
      console.error(err)
      setError(
        'error trying to import your master key, please check it and try it again',
      )
    }
  }

  return (
    <ScrollView>
      <View style={styles.sectionCentered}>
        <Paragraph>enter your private key</Paragraph>
      </View>
      <View style={styles.section}>
        <Header2>Master key</Header2>
        <TextInput
          onChangeText={text => setImportMnemonic(text)}
          value={importMnemonic}
          placeholder="Enter your 12 words master key"
          multiline
          style={styles.input}
          testID="Input.MasterKey"
        />
        {error && <Paragraph>{error}</Paragraph>}
      </View>
      <View style={styles.section}>
        <Button
          onPress={() => {
            handleImportMnemonic()
          }}
          title={'Confirm'}
          testID="Button.Confirm"
        />
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
  input: {
    height: 80,
    margin: 12,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    textAlignVertical: 'top',
  },
})

export default ImportMasterKeyScreen
