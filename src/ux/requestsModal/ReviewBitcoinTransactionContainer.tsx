import { useMemo, useState, useCallback } from 'react'
import {
  convertSatoshiToBtcHuman,
  SendBitcoinRequest,
} from '@rsksmart/rif-wallet-bitcoin'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
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

import {
  BitcoinMiningFeeContainer,
  FeeRecord,
} from './BitcoinMiningFeeContainer'

interface ReviewBitcoinTransactionContainerProps {
  address: string
  request: SendBitcoinRequest
  onConfirm: () => void
  onCancel: () => void
}

export const ReviewBitcoinTransactionContainer = ({
  address,
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
    onConfirm()
  }, [request, onConfirm])

  const onCancelTransaction = useCallback(() => {
    request.reject('Transaction rejected')
    onCancel()
  }, [onCancel, request])

  const data: TransactionSummaryScreenProps = useMemo(() => {
    const convertToUSD = (amount: string): number =>
      convertTokenToUSD(Number(amount), tokenPrices.BTC.price)

    // usd values
    const amountUsd = convertToUSD(amountToPay)
    const feeUsd = convertToUSD(miningFee)
    const totalUsd = amountUsd + feeUsd

    const totalBtc = Number(amountToPay) + Number(miningFee)

    return {
      transaction: {
        tokenValue: {
          balance: amountToPay,
          symbolType: 'icon',
          symbol: TokenSymbol.BTC,
        },
        usdValue: {
          symbol: '$',
          symbolType: 'usd',
          balance: amountUsd,
        },
        fee: {
          symbol: TokenSymbol.BTC,
          tokenValue: miningFee,
          usdValue: feeUsd,
        },
        totalToken: totalBtc,
        totalUsd: totalUsd,
        time: 'approx 1 min',
        to: addressToPay,
      },
      buttons: [
        {
          title: t('transaction_summary_title_confirm_button_title'),
          onPress: onConfirmTransaction,
          color: sharedColors.white,
          textColor: sharedColors.black,
          accessibilityLabel: 'Confirm',
        },
        {
          title: t('transaction_summary_title_cancel_button_title'),
          onPress: onCancelTransaction,
          backgroundVariety: AppButtonBackgroundVarietyEnum.OUTLINED,
          accessibilityLabel: 'Cancel',
        },
      ],
      FeeComponent: (
        <MiningFeeInput
          onChange={onMiningFeeChange}
          defaultMiningFee={payload.miningFee}
        />
      ),
    }
  }, [
    addressToPay,
    amountToPay,
    miningFee,
    onCancelTransaction,
    t,
    onConfirmTransaction,
    tokenPrices,
    payload.miningFee,
    onMiningFeeChange,
  ])
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/*Without a Wallet it's not possible to initiate a transaction */}
      <TransactionSummaryComponent {...data} address={address} />
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

  const { setValue } = methods

  const handleFeeChange = useCallback(
    (text: string) => onChange(text),
    [onChange],
  )

  const onFeeRatesLoaded = useCallback(
    (feeRates: FeeRecord[]) => {
      let newFee
      // If length > 1 then it's fetching the fee from cypher
      if (feeRates.length > 1) {
        newFee = feeRates[1].feeRate
      }
      // If length === 1 then it's fetching the fee from blockbook
      if (feeRates.length === 1) {
        newFee = feeRates[0].feeRate
      }

      if (newFee) {
        handleFeeChange(newFee)
        setValue('miningFee', Number(newFee))
      }
    },
    [handleFeeChange, setValue],
  )

  return (
    <FormProvider {...methods}>
      <Input
        label={t('mining_fee')}
        inputName="miningFee"
        onChangeText={handleFeeChange}
      />
      <BitcoinMiningFeeContainer onFeeRatesLoaded={onFeeRatesLoaded} />
    </FormProvider>
  )
}
