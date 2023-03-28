import { BigNumber, BigNumberish } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  OverriddableTransactionOptions,
  SendTransactionRequest,
} from '@rsksmart/rif-wallet-core'
import { useTranslation } from 'react-i18next'
import { TWO_RIF } from '@rsksmart/rif-relay-light-sdk'

import { balanceToDisplay, convertTokenToUSD, shortAddress } from 'lib/utils'

import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'
import { AppButtonBackgroundVarietyEnum } from 'components/index'
import { defaultChainType, getTokenAddress } from 'core/config'
import { errorHandler } from 'shared/utils'
import { navigationContainerRef } from 'core/Core'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { TokenSymbol } from 'screens/home/TokenImage'
import { sharedColors } from 'shared/constants'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'

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
      const { value, symbol } = enhancedTransactionRequest
      if (value && symbol) {
        onConfirm(value, symbol)
      }
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
    request.reject('User rejects the transaction')
    onCancel()
  }, [onCancel, request])

  // if (!isLoaded || !txCostInRif) {
  //   return (
  //     <View style={sharedStyles.row}>
  //       <RegularText>Loading transaction</RegularText>
  //     </View>
  //   )
  // }

  // if (error) {
  //   return (
  //     <View style={sharedStyles.row}>
  //       <RegularText>{error}</RegularText>
  //     </View>
  //   )
  // }

  useEffect(() => {
    if (enhancedTransactionRequest && txCostInRif) {
      const { to, symbol, value } = enhancedTransactionRequest
      value &&
        to &&
        navigationContainerRef.navigate(rootTabsRouteNames.TransactionSummary, {
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
          contact: {
            address: shortAddress(to),
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
        })
    }
  }, [
    t,
    tokenQuote,
    cancelTransaction,
    confirmTransaction,
    txCostInRif,
    enhancedTransactionRequest,
    rifFee,
  ])

  return null
}
