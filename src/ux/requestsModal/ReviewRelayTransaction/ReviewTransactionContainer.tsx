import { BigNumber, BigNumberish } from 'ethers'
import { useCallback, useMemo, useState } from 'react'
import {
  OverriddableTransactionOptions,
  SendTransactionRequest,
} from '@rsksmart/rif-wallet-core'
import { useTranslation } from 'react-i18next'
import { TWO_RIF } from '@rsksmart/rif-relay-light-sdk'
import { View, StyleSheet } from 'react-native'

import { balanceToDisplay, convertTokenToUSD } from 'lib/utils'

import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { AppButtonBackgroundVarietyEnum } from 'components/index'
import { defaultChainType, getTokenAddress } from 'core/config'
import { errorHandler } from 'shared/utils'
import { TokenSymbol } from 'screens/home/TokenImage'
import { sharedColors } from 'shared/constants'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { getContactsAsObject } from 'store/slices/contactsSlice'
import { TransactionSummaryComponent } from 'screens/transactionSummary/TransactionSummaryComponent'

import useEnhancedWithGas from '../useEnhancedWithGas'

interface Props {
  request: SendTransactionRequest
  onConfirm: (amount: BigNumberish, tokenSymbol: string) => void
  onCancel: () => void
}

export const ReviewTransactionContainer = ({
  request,
  onCancel,
  onConfirm,
}: Props) => {
  const tokenPrices = useAppSelector(selectUsdPrices)
  // enhance the transaction to understand what it is:
  const txRequest = useMemo(() => request.payload[0], [request])
  const { wallet } = useAppSelector(selectActiveWallet)
  const contacts = useAppSelector(getContactsAsObject)
  // this is for typescript, and should not happen as the transaction was created by the wallet instance.
  if (!wallet) {
    throw new Error('no wallet')
  }
  const { enhancedTransactionRequest, isLoaded } = useEnhancedWithGas(
    wallet,
    txRequest,
  )
  const tokenContract = useMemo(
    () =>
      getTokenAddress(
        defaultChainType === ChainTypeEnum.MAINNET ? 'RIF' : 'tRIF',
        defaultChainType,
      ),
    [],
  )
  const tokenQuote = useMemo(() => {
    return tokenPrices[tokenContract].price
  }, [tokenContract, tokenPrices])

  const { t } = useTranslation()
  const txCostInRif = TWO_RIF
  const feeEstimateReady = txCostInRif?.toString() !== '0'

  const rifFee =
    feeEstimateReady && txCostInRif
      ? `${balanceToDisplay(txCostInRif, 18, 0)} tRIF`
      : 'estimating fee...'

  const [error, setError] = useState<string | null>(null)

  /*
  useEffect(() => {
    wallet.rifRelaySdk
      .estimateTransactionCost(txRequest, tokenContract)
      .then(setTxCostInRif)
      .catch(err => setError(errorHandler(err)))
  }, [request, txRequest, wallet.rifRelaySdk, tokenContract])
  */

  const confirmTransaction = useCallback(async () => {
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
      await request.confirm(confirmObject)
      const { value = '0', symbol = '' } = enhancedTransactionRequest
      onConfirm(value, symbol)
    } catch (err: unknown) {
      setError(errorHandler(err))
    }
  }, [
    onConfirm,
    enhancedTransactionRequest,
    request,
    tokenContract,
    txCostInRif,
  ])

  const cancelTransaction = useCallback(() => {
    request.reject('Transaction rejected')
    onCancel()
  }, [onCancel, request])

  const {
    to = '',
    symbol,
    value = '0',
    functionName = '',
  } = enhancedTransactionRequest

  const data = {
    transaction: {
      tokenValue: {
        balance: value.toString(),
        symbolType: 'icon',
        symbol: symbol ?? TokenSymbol.RIF,
      },
      usdValue: {
        balance: convertTokenToUSD(value, tokenQuote, true).toString(),
        symbolType: 'text',
        symbol: '$',
      },
      feeValue: rifFee,
      time: 'approx 1 min',
      total: value?.toString(),
    },
    contact: contacts[to] || { address: to || '' },
    buttons: [
      {
        title: t('transaction_summary_title_confirm_button_title'),
        onPress: confirmTransaction,
        color: sharedColors.white,
        textColor: sharedColors.black,
      },
      {
        style: { marginTop: 10 },
        title: t('transaction_summary_title_cancel_button_title'),
        onPress: cancelTransaction,
        backgroundVariety: AppButtonBackgroundVarietyEnum.OUTLINED,
      },
    ],
    functionName,
  }

  return (
    <View style={styles.container}>
      <TransactionSummaryComponent {...data} isLoaded={isLoaded} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    zIndex: 999,
    position: 'absolute',
  },
})
