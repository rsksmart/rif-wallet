import { useState } from 'react'
import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'

import {
  SignMessageRequest,
  SendTransactionRequest,
  SignTypedDataRequest,
} from 'lib/core'

import SlideUpModal from 'components/slideUpModal/SlideUpModal'
import { InjectSelectedWallet } from 'src/Context'
import { colors } from 'src/styles'
import { RequestWithBitcoin } from 'shared/types'

import { ReviewTransactionContainer } from './ReviewRelayTransaction/ReviewTransactionContainer'
import SignMessageModal from './SignMessageModal'
import SignTypedDataModal from './SignTypedDataModal'
import ConfirmBitcoinTransactionModal from './ConfirmBitcoinTransactionModal'

interface Props {
  request: RequestWithBitcoin
  closeModal: () => void
}

const RequestTypeSwitch = (
  request: RequestWithBitcoin,
  closeModal: () => void,
) => {
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
        <ReviewTransactionContainer request={request} closeModal={closeModal} />
      )
    case 'signTypedData':
      return (
        <SignTypedDataModal
          request={request as SignTypedDataRequest}
          closeModal={closeModal}
        />
      )
    case 'SEND_BITCOIN':
      return (
        <ConfirmBitcoinTransactionModal
          request={request as SendBitcoinRequest}
          closeModal={closeModal}
        />
      )
  }
}

const ModalComponent = ({ request, closeModal }: Props) => {
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
      headerFontColor={colors.black}>
      {RequestTypeSwitch(request, closeModal)}
    </SlideUpModal>
  )
}

export default ModalComponent
