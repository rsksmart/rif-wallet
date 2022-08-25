import React, { useState } from 'react'

import {
  Request,
  SignMessageRequest,
  SendTransactionRequest,
} from '../../lib/core'

import ReviewTransactionModal from './ReviewTransactionModal'
import SignMessageModal from './SignMessageModal'
import SignTypedDataModal from './SignTypedDataModal'
import { InjectSelectedWallet } from '../../Context'
import { SignTypedDataRequest } from '../../lib/core'
import SlideUpModal from '../../components/slideUpModal/SlideUpModal'
import { colors } from '../../styles'

interface Interface {
  request: Request
  closeModal: () => void
  isKeyboardVisible: boolean
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

const ModalComponent: React.FC<Interface> = ({
  request,
  closeModal,
  isKeyboardVisible,
}) => {
  const [showSelector, setShowSelector] = useState<boolean>(true)
  const [animateModal, setAnimateModal] = useState(false)

  const handleCloseModal = () => {
    closeModal()
    setShowSelector(false)
    setAnimateModal(false)
    request.reject('User cancels transaction')
  }

  const handleAnimateModal = () => {
    setAnimateModal(true)
  }

  let modalTitle = ''
  switch (request.type) {
    case 'signMessage':
      modalTitle = 'sign message'
      break
    case 'sendTransaction':
      modalTitle = 'review transaction'
      break
  }

  return (
    <SlideUpModal
      title={modalTitle}
      showSelector={showSelector}
      animateModal={animateModal}
      onModalClosed={handleCloseModal}
      onAnimateModal={handleAnimateModal}
      backgroundColor={colors.lightGray}
      headerFontColor={colors.black}
      isKeyboardVisible={isKeyboardVisible}>
      {RequestTypeSwitch(request, closeModal)}
    </SlideUpModal>
  )
}

export default ModalComponent
