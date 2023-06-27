import { BigNumber, BigNumberish } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  OverriddableTransactionOptions,
  SendTransactionRequest,
} from '@rsksmart/rif-wallet-core'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { balanceToDisplay, convertTokenToUSD } from 'lib/utils'

import { selectActiveWallet, selectChainId } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { AppButtonBackgroundVarietyEnum } from 'components/index'
import { getTokenAddress } from 'core/config'
import { errorHandler } from 'shared/utils'
import { TokenSymbol } from 'screens/home/TokenImage'
import { sharedColors } from 'shared/constants'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { getContactsAsObject } from 'store/slices/contactsSlice'
import { TransactionSummaryComponent } from 'screens/transactionSummary/TransactionSummaryComponent'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { chainTypesById } from 'shared/constants/chainConstants'

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
  const insets = useSafeAreaInsets()
  const tokenPrices = useAppSelector(selectUsdPrices)
  // enhance the transaction to understand what it is:
  const txRequest = useMemo(() => request.payload[0], [request])
  const { wallet } = useAppSelector(selectActiveWallet)
  const contacts = useAppSelector(getContactsAsObject)
  const chainId = useAppSelector(selectChainId)
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
        chainTypesById[chainId] === ChainTypeEnum.MAINNET ? 'RIF' : 'tRIF',
        chainTypesById[chainId],
      ),
    [chainId],
  )
  const tokenQuote = useMemo(() => {
    return tokenPrices[tokenContract].price
  }, [tokenContract, tokenPrices])

  const { t } = useTranslation()
  const [txCostInRif, setTxCostInRif] = useState<BigNumber>()

  const rifFee = useMemo(
    () => (txCostInRif ? `${balanceToDisplay(txCostInRif, 18, 0)}` : '0'),
    [txCostInRif],
  )

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    wallet.rifRelaySdk
      .estimateTransactionCost(txRequest, tokenContract)
      .then(setTxCostInRif)
      .catch(err => setError(errorHandler(err)))
  }, [txRequest, wallet.rifRelaySdk, tokenContract])

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

  const totalTokenValue = Number(value) + Number(rifFee)

  const convertToUSD = useCallback(
    (tokenValue: number, round = false) =>
      convertTokenToUSD(tokenValue, tokenQuote, round).toFixed(2),
    [tokenQuote],
  )

  const data: TransactionSummaryScreenProps = useMemo(
    () => ({
      transaction: {
        tokenValue: {
          balance: value.toString(),
          symbolType: 'icon',
          symbol: symbol ?? TokenSymbol.RIF,
        },
        usdValue: {
          balance: convertToUSD(Number(value), true),
          symbolType: 'usd',
          symbol: '$',
        },
        fee: {
          tokenValue: rifFee,
          usdValue: convertToUSD(Number(rifFee)),
        },
        time: 'approx 1 min',
        total: {
          tokenValue: totalTokenValue.toString(),
          usdValue: convertToUSD(totalTokenValue),
        },
      },
      contact: contacts[to.toLowerCase()] || { address: to || '' },
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
    }),
    [
      value,
      symbol,
      convertToUSD,
      rifFee,
      totalTokenValue,
      contacts,
      to,
      t,
      confirmTransaction,
      cancelTransaction,
      functionName,
    ],
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TransactionSummaryComponent
        {...data}
        isLoaded={isLoaded && txCostInRif !== undefined}
      />
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
