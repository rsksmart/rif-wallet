import { useCallback } from 'react'
// import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'
// import {
//   SignMessageRequest,
//   SignTypedDataRequest,
// } from '@rsksmart/rif-wallet-core'
import { BigNumberish } from 'ethers'

import { RequestWithBitcoin } from 'shared/types'
// import { useFetchBitcoinNetworksAndTokens } from 'screens/send/useFetchBitcoinNetworksAndTokens'
import { ReviewBitcoinTransactionContainer } from 'src/ux/requestsModal/ReviewBitcoinTransactionContainer'

import { ReviewTransactionContainer } from './ReviewRelayTransaction/ReviewTransactionContainer'
// import SignMessageModal from './SignMessageModal'
// import SignTypedDataModal from './SignTypedDataModal'
// import ConfirmBitcoinTransactionModal from './ConfirmBitcoinTransactionModal'

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
