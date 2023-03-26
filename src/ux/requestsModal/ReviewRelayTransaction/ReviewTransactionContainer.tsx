import { BigNumber } from 'ethers'
import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import {
  OverriddableTransactionOptions,
  SendTransactionRequest,
} from '@rsksmart/rif-wallet-core'
import { TWO_RIF } from '@rsksmart/rif-relay-light-sdk'

import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { RegularText } from 'components/index'
import { defaultChainType, getTokenAddress } from 'core/config'
import { sharedStyles } from 'shared/styles'
import { errorHandler } from 'shared/utils'

import useEnhancedWithGas from '../useEnhancedWithGas'
import ReviewTransactionModal from './ReviewTransactionModal'

interface Props {
  request: SendTransactionRequest
  closeModal: () => void
}

export const ReviewTransactionContainer = ({ request, closeModal }: Props) => {
  // const [txCostInRif, setTxCostInRif] = useState<BigNumber | null>(0)
  const txCostInRif = TWO_RIF
  const [error, setError] = useState<string | null>(null)

  const { wallet } = useAppSelector(selectActiveWallet)

  // this is for typescript, and should not happen as the transaction was created by the wallet instance.
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
  const tokenContract = useMemo(
    () =>
      getTokenAddress(
        defaultChainType === ChainTypeEnum.MAINNET ? 'RIF' : 'tRIF',
        defaultChainType,
      ),
    [],
  )

  /*
  useEffect(() => {
    wallet.rifRelaySdk
      .estimateTransactionCost(txRequest, tokenContract)
      .then(setTxCostInRif)
  }, [request, txRequest, wallet.rifRelaySdk, tokenContract])
  */

  const confirmTransaction = useCallback(() => {
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
  }, [
    closeModal,
    enhancedTransactionRequest,
    request,
    tokenContract,
    txCostInRif,
  ])

  const cancelTransaction = useCallback(() => {
    request.reject('User rejects the transaction')
    closeModal()
  }, [closeModal, request])

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
