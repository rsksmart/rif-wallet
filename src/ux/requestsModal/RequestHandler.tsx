import { BigNumberish } from 'ethers'
import { useCallback } from 'react'

import { RequestWithBitcoin } from 'shared/types'
import { ReviewBitcoinTransactionContainer } from 'src/ux/requestsModal/ReviewBitcoinTransactionContainer'

import { ReviewTransactionContainer } from './ReviewRelayTransaction/ReviewTransactionContainer'

interface Props {
  request: RequestWithBitcoin
  closeRequest: () => void
}

export interface RequestTypeSwitchProps {
  request: RequestWithBitcoin
  onCancel: () => void
  onConfirm: (amount: BigNumberish, tokenSymbol: string) => void
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
