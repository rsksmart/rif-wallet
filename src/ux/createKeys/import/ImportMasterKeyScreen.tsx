import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, TextInput } from 'react-native'

import { Button, Header2, Paragraph } from '../../../components'
import { isWordlistValid } from '../../../lib/bitcoinjs'
import { ScreenProps, CreateKeysProps } from '../types'

type ImportMasterKeyScreenProps = {
  createFirstWallet: CreateKeysProps['createFirstWallet']
}

export const ImportMasterKeyScreen: React.FC<
  ScreenProps<'ImportMasterKey'> & ImportMasterKeyScreenProps
> = ({ navigation, createFirstWallet }) => {
  const [importMnemonic, setImportMnemonic] = useState<string>('')

  const [error, setError] = useState<string | null>(null)

  const handleImportMnemonic = async () => {
    const mnemonic = importMnemonic ? importMnemonic.split(' ') : []

    if (!isWordlistValid(mnemonic)) {
      setError('worldlist is not valid')
      return
    }
    // TODO: how many words should have the mnemonic?
    const isValid = mnemonic.length > 12
    if (!isValid) {
      setError('you need to enter at least twelve words')
      return
    }

    try {
      const rifWallet = await createFirstWallet(importMnemonic)
      navigation.navigate('KeysCreated', { address: rifWallet.address })
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
