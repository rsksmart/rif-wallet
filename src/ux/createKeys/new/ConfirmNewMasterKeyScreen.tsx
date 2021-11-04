import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, TextInput } from 'react-native'
import { Button, Header2, Paragraph } from '../../../components'
import { CreateKeysProps, ScreenProps } from '../types'

interface ConfirmMasterKeyScreenProps {
  createFirstWallet: CreateKeysProps['createFirstWallet']
}

export const ConfirmNewMasterKeyScreen: React.FC<
  ScreenProps<'ConfirmNewMasterKey'> & ConfirmMasterKeyScreenProps
> = ({ route, navigation, createFirstWallet }) => {
  const mnemonic = route.params.mnemonic

  const [mnemonicToConfirm, setMnemonicToConfirm] = useState<
    string | undefined
  >()

  const [error, setError] = useState<string | null>(null)

  const saveAndNavigate = async () => {
    const rifWallet = await createFirstWallet(mnemonic)
    navigation.navigate('KeysCreated', { address: rifWallet.address })
  }

  const handleConfirmMnemonic = async () => {
    const isValid = mnemonic === mnemonicToConfirm

    if (!isValid) {
      setError('entered words does not match you your master key')
      return
    }

    await saveAndNavigate()
  }

  return (
    <ScrollView>
      <View style={styles.sectionCentered}>
        <Paragraph>
          With your master key (seed phrase) you are able to create as many
          wallets as you need.
        </Paragraph>
      </View>
      <View style={styles.sectionCentered}>
        <Paragraph>validate your master key</Paragraph>
      </View>
      <View style={styles.section}>
        <Header2>Master key</Header2>
        <TextInput
          onChangeText={text => setMnemonicToConfirm(text)}
          value={mnemonicToConfirm}
          placeholder="Enter your 12 words master key"
          multiline
          style={styles.input}
          testID="Input.Confirm"
        />
        {error && <Paragraph>{error}</Paragraph>}
      </View>
      <View style={styles.section}>
        <Button onPress={saveAndNavigate} title={'Skip'} />
      </View>
      <View style={styles.section}>
        <Button
          onPress={handleConfirmMnemonic}
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
