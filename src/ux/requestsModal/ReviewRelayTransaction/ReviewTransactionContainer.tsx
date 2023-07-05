import {
  OverriddableTransactionOptions,
  SendTransactionRequest,
} from '@rsksmart/rif-wallet-core'
import { BigNumber, constants } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { balanceToDisplay, convertTokenToUSD } from 'lib/utils'

import { AppButtonBackgroundVarietyEnum } from 'components/index'
import { getTokenAddress } from 'core/config'
import { TokenSymbol } from 'screens/home/TokenImage'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { TransactionSummaryComponent } from 'screens/transactionSummary/TransactionSummaryComponent'
import { sharedColors } from 'shared/constants'
import { chainTypesById } from 'shared/constants/chainConstants'
import { errorHandler } from 'shared/utils'
import { selectActiveWallet, selectChainId } from 'store/slices/settingsSlice'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'

import useEnhancedWithGas from '../useEnhancedWithGas'

interface Props {
  request: SendTransactionRequest
  onConfirm: () => void
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
  const { wallet } = useAppSelector(selectActiveWallet)
  const [error, setError] = useState<string | null>(null)
  const [txCostInRif, setTxCostInRif] = useState<BigNumber>()
  const { t } = useTranslation()

  const chainId = useAppSelector(selectChainId)
  // this is for typescript, and should not happen as the transaction was created by the wallet instance.
  if (!wallet) {
    throw new Error('no wallet')
  }

  const txRequest = useMemo(() => request.payload[0], [request])
  const { enhancedTransactionRequest, isLoaded } = useEnhancedWithGas(
    wallet,
    txRequest,
  )

  const {
    to = '',
    symbol = '',
    value = '0',
    functionName = '',
    gasPrice,
    gasLimit,
  } = enhancedTransactionRequest

  const isMainnet = chainTypesById[chainId] === ChainTypeEnum.MAINNET

  const rbtcSymbol = isMainnet ? TokenSymbol.RBTC : TokenSymbol.TRBTC
  const feeSymbol = isMainnet ? TokenSymbol.RIF : TokenSymbol.TRIF
  const feeContract = getTokenAddress(feeSymbol, chainTypesById[chainId])

  const tokenContract = useMemo(() => {
    const rbtcAddress = constants.AddressZero
    if (symbol === rbtcSymbol) {
      return rbtcAddress
    }
    if (symbol) {
      return getTokenAddress(symbol, chainTypesById[chainId])
    }
    return feeContract
  }, [symbol, rbtcSymbol, feeContract, chainId])

  const tokenQuote = tokenPrices[tokenContract].price
  const feeQuote = tokenPrices[feeContract].price

  useEffect(() => {
    wallet.rifRelaySdk
      .estimateTransactionCost(txRequest, feeContract)
      .then(setTxCostInRif)
      .catch(err => setError(errorHandler(err)))
  }, [txRequest, wallet.rifRelaySdk, feeContract])

  const confirmTransaction = useCallback(async () => {
    if (!txCostInRif) {
      throw new Error('token cost has not been estimated')
    }

    const confirmObject: OverriddableTransactionOptions = {
      gasPrice: BigNumber.from(gasPrice),
      gasLimit: BigNumber.from(gasLimit),
      tokenPayment: {
        tokenContract: feeContract,
        tokenAmount: txCostInRif,
      },
    }

    try {
      await request.confirm(confirmObject)
      onConfirm()
    } catch (err: unknown) {
      setError(errorHandler(err))
    }
  }, [txCostInRif, gasPrice, gasLimit, feeContract, request, onConfirm])

  const cancelTransaction = useCallback(() => {
    request.reject('Transaction rejected')
    onCancel()
  }, [onCancel, request])

  const data: TransactionSummaryScreenProps = useMemo(() => {
    const convertToUSD = (tokenValue: number, quote: number) =>
      convertTokenToUSD(tokenValue, quote, true).toFixed(2)

    const feeValue = txCostInRif
      ? `${balanceToDisplay(txCostInRif, 18, 0)}`
      : '0'
    const tokenUsd = convertToUSD(Number(value), tokenQuote)
    const feeUsd = convertToUSD(Number(feeValue), feeQuote)

    return {
      transaction: {
        tokenValue: {
          balance: value.toString(),
          symbolType: 'icon',
          symbol: symbol || feeSymbol,
        },
        usdValue: {
          balance: tokenUsd,
          symbolType: 'usd',
          symbol: '$',
        },
        fee: {
          tokenValue: feeValue,
          usdValue: feeUsd,
          symbol: feeSymbol,
        },
        time: 'approx 1 min',
        to,
      },
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
  }, [
    txCostInRif,
    value,
    tokenQuote,
    feeQuote,
    symbol,
    feeSymbol,
    to,
    t,
    confirmTransaction,
    cancelTransaction,
    functionName,
  ])

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
