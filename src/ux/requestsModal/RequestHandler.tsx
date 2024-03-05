import { RequestType } from 'lib/eoaWallet'

import { RequestWithBitcoin } from 'shared/types'
import { ReviewBitcoinTransactionContainer } from 'src/ux/requestsModal/ReviewBitcoinTransactionContainer'
import { Wallet, addressToUse } from 'shared/wallet'

import { ReviewTransactionContainer } from './ReviewRelayTransaction/ReviewTransactionContainer'
import { SignRequestHandlerContainer } from './SignRequestHandlerContainer'

interface Props {
  wallet: Wallet
  request: RequestWithBitcoin
  closeRequest: () => void
}

export interface RequestTypeSwitchProps {
  wallet: Wallet
  address: string
  request: RequestWithBitcoin
  onCancel: () => void
  onConfirm: () => void
}

const RequestTypeSwitch = ({
  wallet,
  address,
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
      wallet={wallet}
      address={address}
      request={request}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}

export const RequestHandler = ({ wallet, request, closeRequest }: Props) => {
  const address = addressToUse(wallet)

  return RequestTypeSwitch({
    wallet,
    address,
    request,
    onCancel: closeRequest,
    onConfirm: closeRequest,
  })
}
