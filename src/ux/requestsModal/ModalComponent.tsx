import React from 'react'
import { Modal, StyleSheet, View } from 'react-native'

import {
  Request,
  SignMessageRequest,
  SendTransactionRequest,
} from '../../lib/core/RIFWallet'

import ReviewTransactionModal from './ReviewTransactionModal'
import SignMessageModal from './SignMessageModal'
import SignTypedDataModal from './SignTypedDataModal'
import { sharedStyles } from './sharedStyles'
import { InjectSelectedWallet } from '../../Context'
import { SignTypedDataRequest } from '../../lib/core'

interface Interface {
  request: Request
  closeModal: () => void
}

const ReviewTransactionInjected = InjectSelectedWallet(ReviewTransactionModal)

const RequestTypeSwitch = (request: Request, closeModal: () => void) => {
  switch (request.type) {
    case 'signMessage':
      return (
        <SignMessageModal
          request={request as SignMessageRequest}
          closeModal={closeModal}
        />
      )
    case 'sendTransaction':
      return (
        <ReviewTransactionInjected
          request={request as SendTransactionRequest}
          closeModal={closeModal}
        />
      )
    case 'signTypedData':
      return (
        <SignTypedDataModal
          request={request as SignTypedDataRequest}
          closeModal={closeModal}
        />
      )
  }
}

const ModalComponent: React.FC<Interface> = ({ request, closeModal }) => {
  return (
    <View style={sharedStyles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={[sharedStyles.centeredView, styles.blurBackground]}>
          <View style={sharedStyles.modalView}>
            {RequestTypeSwitch(request, closeModal)}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ModalComponent

const styles = StyleSheet.create({
  blurBackground: {
    marginTop: 0,
    backgroundColor: 'rgba(55, 63, 72, 0.88)',
  },
})
