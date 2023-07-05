import { useCallback } from 'react'

import { RequestWithBitcoin } from 'shared/types'
import { ReviewBitcoinTransactionContainer } from 'src/ux/requestsModal/ReviewBitcoinTransactionContainer'

import { ReviewTransactionContainer } from './ReviewRelayTransaction/ReviewTransactionContainer'
import { SignMessageRequestContainer } from './SignMessageRequestContainer'

interface Props {
  request: RequestWithBitcoin
  closeRequest: () => void
}

export interface RequestTypeSwitchProps {
  request: RequestWithBitcoin
  onCancel: () => void
  onConfirm: () => void
}

const RequestTypeSwitch = ({
  request,
  onCancel,
  onConfirm,
}: RequestTypeSwitchProps) => {
  let ComponentToRender = null
  switch (request.type) {
    case 'sendTransaction':
      ComponentToRender = ReviewTransactionContainer
      break
    case 'SEND_BITCOIN':
      ComponentToRender = ReviewBitcoinTransactionContainer
      break
    case 'signMessage':
      ComponentToRender = SignMessageRequestContainer
      break
    default:
      return null
  }
  return (
    <ComponentToRender
      request={request}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}

export const RequestHandler = ({ request, closeRequest }: Props) => {
  const onConfirm = useCallback(() => {
    closeRequest()
  }, [closeRequest])

  const onCancel = useCallback(() => {
    closeRequest()
  }, [closeRequest])

  return RequestTypeSwitch({ request, onCancel, onConfirm })
}
