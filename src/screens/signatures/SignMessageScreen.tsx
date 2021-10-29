import React, { useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

import { useSelectedWallet } from '../../Context'
import { Button, CopyComponent, Header1, Paragraph } from '../../components'

export const SignMessageScreen = () => {
  const rifWallet = useSelectedWallet()

  const [message, setMessage] = useState<string>('Hello World!')
  const [response, setResponse] = useState<string | null>(null)

  const signMessage = () => {
    setResponse(null)
    rifWallet
      .signMessage(message)
      .then((hash: string) => setResponse(hash))
      .catch((err: any) => setResponse(err.toString()))
  }
  return (
    <View>
      <Header1>Sign Message</Header1>

      <Paragraph>Signing with EOA Account:</Paragraph>
      <CopyComponent value={rifWallet.smartWallet.wallet.address} />

      <Paragraph>Message:</Paragraph>
      <TextInput
        value={message}
        onChangeText={setMessage}
        style={styles.textInput}
      />

      <Button onPress={signMessage} title="Sign Message" />
      {response && (
        <>
          <Paragraph>Response:</Paragraph>
          <CopyComponent value={response} />
        </>
      )}
    </View>
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
