import { BigNumberish } from 'ethers'
import {
  convertSatoshiToBtcHuman,
  SendBitcoinRequest,
} from '@rsksmart/rif-wallet-bitcoin'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useCallback } from 'react'

import { convertTokenToUSD } from 'lib/utils'

import { TransactionSummaryComponent } from 'screens/transactionSummary/TransactionSummaryComponent'
import { TokenSymbol } from 'screens/home/TokenImage'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'
import { sharedColors } from 'shared/constants'
import { AppButtonBackgroundVarietyEnum } from 'src/components'

interface ReviewBitcoinTransactionContainerProps {
  request: SendBitcoinRequest
  onConfirm: (amount: BigNumberish, tokenSymbol: string) => void
  onCancel: () => void
}

export const ReviewBitcoinTransactionContainer = ({
  request,
  onConfirm,
  onCancel,
}: ReviewBitcoinTransactionContainerProps) => {
  const { t } = useTranslation()
  const tokenPrices = useAppSelector(selectUsdPrices)
  const {
    payload: { amountToPay, addressToPay, miningFee },
  } = request

  const onConfirmTransaction = useCallback(async () => {
    request.confirm().catch(err => {
      request.reject(err)
    })
    onConfirm(convertSatoshiToBtcHuman(amountToPay), TokenSymbol.BTC)
  }, [request, onConfirm, amountToPay])

  const onCancelTransaction = useCallback(() => {
    request.reject('Transaction rejected')
    onCancel()
  }, [onCancel, request])

  const data = {
    transaction: {
      tokenValue: {
        balance: convertSatoshiToBtcHuman(amountToPay),
        symbolType: 'icon' as const,
        symbol: TokenSymbol.BTC,
      },
      usdValue: {
        balance: convertTokenToUSD(
          Number(convertSatoshiToBtcHuman(amountToPay)),
          tokenPrices.BTC.price,
          true,
        ).toString(),
        symbolType: 'text' as const,
        symbol: '$',
      },
      feeValue: convertSatoshiToBtcHuman(miningFee),
      time: 'approx 1 min',
      total: convertSatoshiToBtcHuman(amountToPay),
    },
    contact: {
      address: addressToPay,
    },
    buttons: [
      {
        title: t('transaction_summary_title_confirm_button_title'),
        onPress: onConfirmTransaction,
        color: sharedColors.white,
        textColor: sharedColors.black,
      },
      {
        title: t('transaction_summary_title_cancel_button_title'),
        onPress: onCancelTransaction,
        backgroundVariety: AppButtonBackgroundVarietyEnum.OUTLINED,
      },
    ],
  }
  return (
    <View style={styles.container}>
      <TransactionSummaryComponent {...data} />
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
