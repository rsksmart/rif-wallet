import { RequestType } from 'lib/eoaWallet'

import { RequestWithBitcoin } from 'shared/types'
import { ReviewBitcoinTransactionContainer } from 'src/ux/requestsModal/ReviewBitcoinTransactionContainer'

import { ReviewTransactionContainer } from './ReviewRelayTransaction/ReviewTransactionContainer'
import { SignRequestHandlerContainer } from './SignRequestHandlerContainer'

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
    case RequestType.SEND_TRANSACTION:
      ComponentToRender = ReviewTransactionContainer
      break
    case 'SEND_BITCOIN':
      ComponentToRender = ReviewBitcoinTransactionContainer
      break
    case RequestType.SIGN_MESSAGE:
    case RequestType.SIGN_TYPED_DATA:
      ComponentToRender = SignRequestHandlerContainer
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

export const RequestHandler = ({ request, closeRequest }: Props) =>
  RequestTypeSwitch({
    request,
    onCancel: closeRequest,
    onConfirm: closeRequest,
  })
