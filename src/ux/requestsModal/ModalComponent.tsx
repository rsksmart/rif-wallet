import React from 'react'
import { Modal, View } from 'react-native'

import {
  Request,
  SignMessageRequest,
  SendTransactionRequest,
} from '../../lib/core/RIFWallet'

import ReviewTransactionModal from './ReviewTransactionModal'
import SignMessageModal from './SignMessageModal'
import SignTypedDataModal from './SignTypedDataModal'
import { sharedStyles } from './sharedStyles'

interface Interface {
  request: Request
  closeModal: () => void
}

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
        <ReviewTransactionModal
          request={request as SendTransactionRequest}
          closeModal={closeModal}
        />
      )
    case 'signTypedData':
      return <SignTypedDataModal request={request} closeModal={closeModal} />
  }
}

const ModalComponent: React.FC<Interface> = ({ request, closeModal }) => {
  return (
    <View style={sharedStyles.centeredView}>
      <Modal animationType="slide" transparent={false} visible={true}>
        <View style={sharedStyles.centeredView}>
          <View style={sharedStyles.modalView}>
            {RequestTypeSwitch(request, closeModal)}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ModalComponent
