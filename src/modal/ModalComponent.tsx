import React from 'react'
import { Request } from '../lib/core/RIFWallet'
import ReviewTransactionModal from './ReviewTransactionModal'
import SignMessageModal from './SignMessageModal'

interface Interface {
  request: Request
  closeModal: () => void
}

const ModalComponent: React.FC<Interface> = ({ request, closeModal }) => {
  switch (request.type) {
    case 'sendTransaction':
      return (
        <ReviewTransactionModal request={request} closeModal={closeModal} />
      )
    case 'signMessage':
      return <SignMessageModal request={request} closeModal={closeModal} />
    default:
      return <></>
  }
}

export default ModalComponent
