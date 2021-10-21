import React from 'react'
import { View, Modal, Text, StyleSheet } from 'react-native'
import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'
import { Request } from '../lib/core/RIFWallet'
import { styles } from './ReviewTransactionModal'

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
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={false} visible={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Header2>Sign Message</Header2>

            <Paragraph>Do you want to sign this message?</Paragraph>

            <Text style={localStyles.message}>{request.payload.message}</Text>

            <View style={styles.row}>
              <View style={styles.column}>
                <Button onPress={signMessage} title="Sign Message" />
              </View>
              <View style={styles.column}>
                <Button onPress={reject} title="Reject" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const localStyles = StyleSheet.create({
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
