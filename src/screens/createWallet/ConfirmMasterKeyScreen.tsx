import { NavigationProp, ParamListBase } from '@react-navigation/core'
import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, TextInput } from 'react-native'

import { Header2, Paragraph } from '../../components/typography'

import Button from '../../components/button'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const ConfirmMasterKeyScreen: React.FC<Interface> = ({ route, navigation }) => {
  const mnemonic = route.params.mnemonic as string

  const [mnemonicToConfirm, setMnemonicToConfirm] = useState<
    string | undefined
  >()

  const [error, setError] = useState<string | null>(null)

  const handleConfirmMnemonic = () => {
    const isValid = mnemonic === mnemonicToConfirm

    if (!isValid) {
      setError('entered words does not match you your master key')
      return
    }

    navigation.navigate('WalletCreated', { mnemonic })
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
        <Button
          onPress={() => navigation.navigate('WalletCreated', { mnemonic })}
          title={'Skip'}
        />
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

export default ConfirmMasterKeyScreen
