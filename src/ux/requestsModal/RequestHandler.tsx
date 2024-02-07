import { RequestWithBitcoin } from 'shared/types'
import { ReviewBitcoinTransactionContainer } from 'src/ux/requestsModal/ReviewBitcoinTransactionContainer'

import { ReviewTransactionContainer } from './ReviewRelayTransaction/ReviewTransactionContainer'
import { SignRequestHandlerContainer } from './SignRequestHandlerContainer'

interface Props {
  requests: RequestWithBitcoin[]
  closeRequest: () => void
}

export interface RequestTypeSwitchProps {
  requests: RequestWithBitcoin[]
  onCancel: () => void
  onConfirm: () => void
}

const RequestTypeSwitch = ({
  requests,
  onCancel,
  onConfirm,
}: RequestTypeSwitchProps) => {
  return requests.map(r => {
    switch (r.type) {
      case 'sendTransaction':
        return (
          <ReviewTransactionContainer
            key={r.payload.data?.toString()}
            request={r}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )
      case 'SEND_BITCOIN':
        return (
          <ReviewBitcoinTransactionContainer
            key={r.payload.addressToPay}
            request={r}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )

      case 'signMessage':
      case 'signTypedData':
        return (
          <SignRequestHandlerContainer
            key={r.payload.toString()}
            request={r}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )
    }
  })
}

export const RequestHandler = ({ requests, closeRequest }: Props) => {
  return (
    <>
      {RequestTypeSwitch({
        requests,
        onCancel: closeRequest,
        onConfirm: closeRequest,
      })}
    </>
  )
}
