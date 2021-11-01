import React, { useState } from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { Button, CopyComponent, Header1, Paragraph } from '../../components'
import { ScreenWithWallet } from '../types'

export enum TestID {
  Input = 'Message.Input',
  Result = 'Sig.Text',
}

export const SignMessageScreen: React.FC<ScreenWithWallet> = ({ wallet }) => {
  const [message, setMessage] = useState<string>('Hello World!')
  const [response, setResponse] = useState<string>('')

  const signMessage = () => {
    setResponse('')
    wallet
      .signMessage(message)
      .then((hash: string) => setResponse(hash))
      .catch((err: any) => setResponse(err.toString()))
  }

  return (
    <ScrollView>
      <Header1>Sign Message</Header1>

      <Paragraph>Signing with EOA Account:</Paragraph>
      <CopyComponent value={wallet.eoaAddress} />

      <Paragraph>Message:</Paragraph>
      <TextInput
        value={message}
        onChangeText={setMessage}
        style={styles.textInput}
        testID={TestID.Input}
      />

      <Button onPress={signMessage} title="Sign Message" />
      <Paragraph>Response:</Paragraph>
      <CopyComponent value={response} testID={TestID.Result} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  textInput: {
    margin: 10,
    padding: 5,
    borderBottomWidth: 1,
    fontSize: 26,
  },
})
