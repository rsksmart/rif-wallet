import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import Icon from 'react-native-vector-icons/FontAwesome5'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { BigNumber } from 'ethers'

import {
  balanceToDisplay,
  convertTokenToUSD,
  convertUSDtoToken,
  sanitizeDecimalText,
  sanitizeMaxDecimalText,
} from 'lib/utils'

import { AddressInputSelector } from 'components/address/AddressInputSelector'
import {
  AppButton,
  AppButtonBackgroundVarietyEnum,
  AppTouchable,
  Input,
  Typography,
} from 'components/index'
import { CurrencyValue, TokenBalance } from 'components/token'
import { IPrice } from 'src/subscriptions/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'

import { MixedTokenAndNetworkType } from './types'
import { PortfolioComponent } from '../home/PortfolioComponent'
import { TokenImage, TokenSymbol } from '../home/TokenImage'

interface Props {
  onConfirm: (
    selectedToken: MixedTokenAndNetworkType,
    amount: number,
    to: string,
  ) => void
  onCancel: () => void
  tokenList: MixedTokenAndNetworkType[]
  tokenPrices: Record<string, IPrice>
  chainId: number
  initialValues: {
    asset?: MixedTokenAndNetworkType
    amount?: number
    recipient?: string
  }
}

interface FormValues {
  amount: number
  to: string
  isToValid: boolean
}

const transactionFeeMap = new Map([
  [TokenSymbol.RIF, true],
  [TokenSymbol.TRIF, true],
  [TokenSymbol.RDOC, true],
])

const transactionSchema = yup.object().shape({
  amount: yup.number().min(0.00001),
  to: yup.string().required(),
  balance: yup.string(),
  isToValid: yup.boolean().isTrue(),
})

export const TransactionForm = ({
  initialValues,
  tokenList,
  chainId,
  tokenPrices,
  onConfirm,
  onCancel,
}: Props) => {
  const { t } = useTranslation()
  const [showTxSelector, setShowTxSelector] = useState(false)
  const [showTxFeeSelector, setShowTxFeeSelector] = useState(false)
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>('')
  const [selectedToken, setSelectedToken] = useState<MixedTokenAndNetworkType>(
    initialValues.asset || tokenList[0],
  )
  const [selectedFeeToken, setSelectedFeeToken] =
    useState<MixedTokenAndNetworkType>(selectedToken)

  const tokenFeeList = useMemo(() => {
    if (selectedToken.symbol !== TokenSymbol.BTCT) {
      return tokenList.filter(tok =>
        transactionFeeMap.get(tok.symbol as TokenSymbol),
      )
    }

    return [selectedToken]
  }, [tokenList, selectedToken])

  const tokenQuote = selectedToken.contractAddress.startsWith('BITCOIN')
    ? tokenPrices.BTC.price
    : tokenPrices[selectedToken.contractAddress]?.price

  const methods = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      amount: initialValues.amount || 0,
      to: initialValues.recipient || '',
      isToValid: false,
    },
    resolver: yupResolver(transactionSchema),
  })
  const {
    setValue,
    handleSubmit,
    resetField,
    watch,
    formState: { errors },
  } = methods
  const amount = watch('amount')
  const to = watch('to')

  const [firstBalance, setFirstBalance] = useState<CurrencyValue>({
    balance: '0',
    symbolType: 'icon',
    symbol: selectedToken.symbol,
  })
  const [secondBalance, setSecondBalance] = useState<CurrencyValue>({
    balance: '0',
    symbolType: 'text',
    symbol: '$',
  })
  const [balanceInverted, setBalanceInverted] = useState(false)

  const handleAmountChange = useCallback(
    (newAmount: string, _balanceInverted: boolean) => {
      const text = sanitizeMaxDecimalText(sanitizeDecimalText(newAmount))
      const numberAmount = Number(text)
      setFirstBalance(prev => ({
        ...prev,
        balance: text,
      }))
      if (_balanceInverted) {
        const balanceToSet = convertUSDtoToken(numberAmount, tokenQuote)
        setValue('amount', balanceToSet)

        setSecondBalance(prev => ({
          ...prev,
          balance: balanceToSet.toString(),
        }))
      } else {
        setValue('amount', numberAmount)
        setSecondBalance(prev => ({
          ...prev,
          balance: convertTokenToUSD(numberAmount, tokenQuote).toString(),
        }))
      }
    },
    [setValue, tokenQuote],
  )

  const handleTargetAddressChange = useCallback(
    (address: string, isValid: boolean) => {
      setValue('to', address)
      setValue('isToValid', isValid)
    },
    [setValue],
  )

  const handleConfirmClick = useCallback(
    (values: FormValues) => {
      onConfirm(selectedToken, values.amount, values.to)
    },
    [selectedToken, onConfirm],
  )

  const onChangeSelectedTokenAddress = useCallback(
    (address: string) => {
      if (address !== selectedTokenAddress) {
        const token = tokenList.filter(
          value => value.contractAddress === address,
        )[0]
        setSelectedTokenAddress(address)
        setSelectedToken(oldToken => {
          // Reset address when token type is changed
          if ('isBitcoin' in oldToken === !('isBitcoin' in token)) {
            handleTargetAddressChange('', false)
          }
          return token
        })
        const tokenObject: CurrencyValue = {
          balance: '0',
          symbol: token.symbol,
          symbolType: 'icon',
        }

        setFirstBalance(prevFirstBalance => {
          if (!balanceInverted) {
            return tokenObject
          } else {
            return prevFirstBalance
          }
        })
        setSecondBalance(prevSecondBalance => {
          if (!balanceInverted) {
            return prevSecondBalance
          } else {
            return tokenObject
          }
        })
        setSelectedFeeToken(token)
        handleAmountChange('0', balanceInverted)
      }
    },
    [
      selectedTokenAddress,
      handleTargetAddressChange,
      tokenList,
      balanceInverted,
      handleAmountChange,
    ],
  )

  const onSwapBalance = useCallback(() => {
    setBalanceInverted(prevInverted => {
      setFirstBalance(prevFirstBalance => {
        setSecondBalance(prevFirstBalance)
        handleAmountChange(prevFirstBalance.balance, !prevInverted)
        return secondBalance
      })
      return !prevInverted
    })
  }, [secondBalance, handleAmountChange])

  const toggleShowTx = useCallback(() => {
    setShowTxSelector(prev => !prev)
  }, [])

  const toggleShowTxFee = useCallback(() => {
    setShowTxFeeSelector(prev => !prev)
  }, [])

  const onChangeSelectedFee = useCallback(
    (fee: string) => {
      setSelectedFeeToken(
        tokenList.filter(value => value.contractAddress === fee)[0],
      )
    },
    [tokenList],
  )

  useEffect(() => {
    console.log('FIRST BALANCE', firstBalance)
    console.log('SECOND BALANCE', secondBalance)
    console.log('ERRORS', errors)
  }, [firstBalance, secondBalance, errors])

  return (
    <>
      <ScrollView
        style={styles.transactionForm}
        contentContainerStyle={styles.transactionScrollContainer}>
        <FormProvider {...methods}>
          <AddressInputSelector
            label={t('transaction_form_recepient_label')}
            placeholder={t('transaction_form_recepient_label')}
            initialValue={initialValues.recipient ?? ''}
            inputName={'to'}
            onChangeAddress={handleTargetAddressChange}
            resetValue={() => {
              resetField('to')
              resetField('isToValid')
            }}
            testID={'To.Input'}
            chainId={chainId}
            token={selectedToken}
          />
          <TokenBalance
            style={sharedStyles.marginTop40}
            firstValue={firstBalance}
            secondValue={secondBalance}
            color={sharedColors.black}
            onSwap={onSwapBalance}
            editable
            handleAmountChange={value =>
              handleAmountChange(value, balanceInverted)
            }
          />
          <Input
            containerStyle={sharedStyles.marginTop40}
            inputName={'balance'}
            label={`${selectedToken.symbol} ${t(
              'transaction_form_balance_label',
            )}`}
            placeholder={`${balanceToDisplay(
              selectedToken.balance,
              selectedToken.decimals,
              5,
            )} ${selectedToken.symbol}`}
            isReadOnly
          />
          <AppTouchable
            width={'100%'}
            onPress={toggleShowTx}
            style={styles.assetToggleRow}>
            <>
              <Typography type={'h3'}>
                {t('transaction_form_tx_dropdown')}
              </Typography>
              <Icon
                name={showTxSelector ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={sharedColors.white}
              />
            </>
          </AppTouchable>
          {showTxSelector ? (
            <PortfolioComponent
              style={styles.txSelector}
              setSelectedAddress={onChangeSelectedTokenAddress}
              selectedAddress={selectedTokenAddress}
              balances={tokenList}
              prices={tokenPrices}
            />
          ) : null}
          {firstBalance.balance ? (
            <Input
              inputName={'fee'}
              label={t('transaction_form_fee_input_label')}
              placeholder={`${selectedFeeToken.symbol}`}
              leftIcon={
                <TokenImage
                  symbol={selectedFeeToken.symbol}
                  height={32}
                  width={32}
                />
              }
              isReadOnly
            />
          ) : null}
          {firstBalance.balance ? (
            <AppTouchable
              width={'100%'}
              onPress={toggleShowTxFee}
              style={styles.assetToggleRow}>
              <>
                <Typography type={'h3'}>
                  {t('transaction_form_fee_dropdown')}
                </Typography>
                <Icon
                  name={showTxFeeSelector ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={sharedColors.white}
                />
              </>
            </AppTouchable>
          ) : null}
          {showTxFeeSelector ? (
            <PortfolioComponent
              style={styles.txSelector}
              setSelectedAddress={onChangeSelectedFee}
              selectedAddress={selectedFeeToken.contractAddress}
              balances={tokenFeeList}
              prices={tokenPrices}
            />
          ) : null}
        </FormProvider>
      </ScrollView>
      <View style={styles.buttons}>
        <AppButton
          style={styles.button}
          title={`${t('transaction_form_button_send')} ${amount} ${
            selectedToken.symbol
          }`}
          onPress={handleSubmit(handleConfirmClick)}
          disabled={
            BigNumber.from(selectedToken.balance).isZero() ||
            to.length === 0 ||
            amount === 0
          }
          color={sharedColors.white}
          textColor={sharedColors.black}
        />
        <AppButton
          style={[styles.button, styles.buttonCancel]}
          title={t('transaction_form_button_cancel')}
          onPress={onCancel}
          backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  transactionForm: castStyle.view({
    paddingTop: 24,
    height: '100%',
    width: '100%',
  }),
  transactionScrollContainer: castStyle.view({ paddingBottom: 200 }),
  buttons: castStyle.view({
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  }),
  button: castStyle.view({
    height: 54,
  }),
  buttonCancel: castStyle.view({
    marginTop: 10,
    backgroundColor: sharedColors.black,
  }),
  assetToggleRow: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  }),
  txSelector: castStyle.view({ marginTop: 22 }),
})
