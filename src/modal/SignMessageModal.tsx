import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'
import { Request } from '../lib/core/RIFWallet'
import { styles as sharedStyles } from './ModalComponent'

interface Interface {
  request: Request
  closeModal: () => void
}

const SignMessageMotal: React.FC<Interface> = ({ request, closeModal }) => {
  const reject = () => {
    request.reject()
    closeModal()
  }

  const signMessage = () => {
    request.confirm()
    closeModal()
  }

  return (
    <View>
      <Header2>Sign Message</Header2>

      <Paragraph>Do you want to sign this message?</Paragraph>

      <Text style={styles.message}>{request.payload.message}</Text>

      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Button onPress={signMessage} title="Sign Message" />
        </View>
        <View style={sharedStyles.column}>
          <Button onPress={reject} title="Reject" />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  message: {
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
})

export default SignMessageMotal
