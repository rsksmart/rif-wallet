import { useMemo, useState } from 'react'
import { BigNumberish } from 'ethers'
import {
  convertSatoshiToBtcHuman,
  SendBitcoinRequest,
} from '@rsksmart/rif-wallet-bitcoin'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FormProvider, useForm } from 'react-hook-form'

import { convertTokenToUSD } from 'lib/utils'

import { TransactionSummaryComponent } from 'screens/transactionSummary/TransactionSummaryComponent'
import { TokenSymbol } from 'screens/home/TokenImage'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'
import { sharedColors } from 'shared/constants'
import { AppButtonBackgroundVarietyEnum, Input } from 'components/index'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'

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
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const tokenPrices = useAppSelector(selectUsdPrices)
  const {
    payload: { addressToPay, payment, ...payload },
  } = request

  const [miningFeeState, setMiningFeeState] = useState(payload.miningFee)

  const onMiningFeeChange = useCallback(
    (miningFee: string) => {
      const miningFeeParsed = parseInt(miningFee, 10) || 0
      setMiningFeeState(miningFeeParsed)
      payment.setMiningFee(miningFeeParsed)
    },
    [payment],
  )

  const miningFee = useMemo(
    () => convertSatoshiToBtcHuman(miningFeeState),
    [miningFeeState],
  )
  const amountToPay = useMemo(
    () => convertSatoshiToBtcHuman(payload.amountToPay),
    [payload],
  )

  const onConfirmTransaction = useCallback(async () => {
    request.confirm().catch(err => {
      request.reject(err)
    })
    onConfirm(amountToPay, TokenSymbol.BTC)
  }, [request, onConfirm, amountToPay])

  const onCancelTransaction = useCallback(() => {
    request.reject('Transaction rejected')
    onCancel()
  }, [onCancel, request])

  const data: TransactionSummaryScreenProps = useMemo(
    () => ({
      transaction: {
        tokenValue: {
          balance: amountToPay,
          symbolType: 'icon',
          symbol: TokenSymbol.BTC,
        },
        usdValue: {
          balance: convertTokenToUSD(
            Number(amountToPay),
            tokenPrices.BTC.price,
            true,
          ).toString(),
          symbolType: 'usd',
          symbol: '$',
        },
        fee: {
          tokenValue: miningFee,
          usdValue: convertTokenToUSD(
            Number(miningFee),
            tokenPrices.BTC.price,
          ).toString(),
        },
        time: 'approx 1 min',
        total: {
          tokenValue: amountToPay,
          usdValue: convertTokenToUSD(
            Number(amountToPay) + Number(miningFee),
            tokenPrices.BTC.price,
          ).toString(),
        },
        to: addressToPay,
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
      FeeComponent: (
        <MiningFeeInput
          onChange={onMiningFeeChange}
          defaultMiningFee={payload.miningFee}
        />
      ),
    }),
    [
      addressToPay,
      amountToPay,
      miningFee,
      onCancelTransaction,
      t,
      onConfirmTransaction,
      tokenPrices,
      payload.miningFee,
      onMiningFeeChange,
    ],
  )
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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

interface MiningFeeInputProps {
  onChange: (text: string) => void
  defaultMiningFee?: number
}
const MiningFeeInput = ({
  onChange,
  defaultMiningFee,
}: MiningFeeInputProps) => {
  const { t } = useTranslation()
  const methods = useForm({
    defaultValues: {
      miningFee: defaultMiningFee || 141,
    },
  })

  const handleFeeChange = (text: string) => onChange(text)

  return (
    <FormProvider {...methods}>
      <Input
        label={t('mining_fee')}
        inputName="miningFee"
        onChangeText={handleFeeChange}
      />
    </FormProvider>
  )
}
