import React, { useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Button from '../../components/button'
import CopyComponent from '../../components/copy'
import { Header1, Paragraph } from '../../components/typography'
import { RIFWallet } from '../../lib/core/RIFWallet'
import { useSelectedWallet } from '../../Context'

interface Interface {
  route: { params: { account: RIFWallet } }
  navigation: any
}

const SignMessageScreen: React.FC<Interface> = ({ route, navigation }) => {
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

      <Button onPress={navigation.goBack} title="Go Back" />
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

export default SignMessageScreen
