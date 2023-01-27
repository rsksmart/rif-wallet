import { RIF_TOKEN_ADDRESS_TESTNET } from '@rsksmart/rif-relay-light-sdk'
import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import { RegularText } from 'src/components'
import {
  OverriddableTransactionOptions,
  SendTransactionRequest,
} from 'src/lib/core'
import { selectActiveWallet } from 'src/redux/slices/settingsSlice'
import { useAppSelector } from 'src/redux/storeUtils'
import { sharedStyles } from 'src/shared/styles'
import { errorHandler } from 'src/shared/utils'
import useEnhancedWithGas from '../useEnhancedWithGas'

import ReviewTransactionModal from './ReviewTransactionModal'

interface Props {
  request: SendTransactionRequest
  closeModal: () => void
}

export const ReviewTransactionContainer = ({ request, closeModal }: Props) => {
  const [txCostInRif, setTxCostInRif] = useState<BigNumber | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { wallet } = useAppSelector(selectActiveWallet)

  // this is for typescript, and will never happen as the transaction was created by the wallet instance.
  if (!wallet) {
    throw new Error('no wallet')
  }

  // enhance the transaction to understand what it is:
  const txRequest = useMemo(() => request.payload[0], [request])
  const { enhancedTransactionRequest, isLoaded } = useEnhancedWithGas(
    wallet,
    txRequest,
  )

  // estimate the tx cost in token:
  const tokenContract = RIF_TOKEN_ADDRESS_TESTNET
  useEffect(() => {
    wallet.rifRelaySdk
      .estimateTransactionCost(txRequest, tokenContract)
      .then(setTxCostInRif)
  }, [request, txRequest, wallet.rifRelaySdk, tokenContract])

  const confirmTransaction = () => {
    if (!txCostInRif) {
      throw new Error('token cost has not been estimated')
    }

    const confirmObject: OverriddableTransactionOptions = {
      gasPrice: BigNumber.from(enhancedTransactionRequest.gasPrice),
      gasLimit: BigNumber.from(enhancedTransactionRequest.gasLimit),
      tokenPayment: {
        tokenContract,
        tokenAmount: txCostInRif,
      },
    }

    try {
      request.confirm(confirmObject)
      closeModal()
    } catch (err: unknown) {
      setError(errorHandler(err))
    }
  }

  const cancelTransaction = () => {
    request.reject('User rejects the transaction')
    closeModal()
  }

  if (!isLoaded || !txCostInRif) {
    return (
      <View style={sharedStyles.row}>
        <RegularText>Loading transaction</RegularText>
      </View>
    )
  }

  if (error) {
    return (
      <View style={sharedStyles.row}>
        <RegularText>{error}</RegularText>
      </View>
    )
  }

  return (
    <ReviewTransactionModal
      enhancedTransactionRequest={enhancedTransactionRequest}
      txCostInRif={txCostInRif}
      confirmTransaction={confirmTransaction}
      cancelTransaction={cancelTransaction}
    />
  )
}
