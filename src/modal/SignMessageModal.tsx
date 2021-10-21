import React from 'react'
import { View, Modal, Text } from 'react-native'
import Button from '../components/button'
import { Header2 } from '../components/typography'
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

            <Text>{request.payload.message}</Text>

            <Button onPress={signMessage} title="Sign Message" />
            <Button onPress={reject} title="Reject" />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default SignMessageMotal
