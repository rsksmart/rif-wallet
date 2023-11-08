import { useCallback, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  convertTokenToUSD,
  convertUSDtoToken,
  roundBalance,
  sanitizeDecimalText,
  sanitizeMaxDecimalText,
  shortAddress,
} from 'lib/utils'

import {
  AddressInput,
  AppButton,
  AppButtonBackgroundVarietyEnum,
  AppTouchable,
  Avatar,
  Input,
  Typography,
} from 'components/index'
import { CurrencyValue, TokenBalance } from 'components/token'
import { sharedColors, testIDs } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { IPrice } from 'src/subscriptions/types'
import { TokenBalanceObject } from 'store/slices/balancesSlice/types'
import { Contact, ContactWithAddressRequired } from 'src/shared/types'
import { ChainTypesByIdType } from 'shared/constants/chainConstants'
import { navigationContainerRef } from 'src/core/Core'
import { rootTabsRouteNames } from 'src/navigation/rootNavigator'
import { contactsStackRouteNames } from 'src/navigation/contactsNavigator'

import { TokenImage, TokenSymbol } from '../home/TokenImage'
import { PortfolioComponent } from '../home/PortfolioComponent'

interface Props {
  onConfirm: (
    selectedToken: TokenBalanceObject,
    selectedFeeToken: TokenBalanceObject,
    amount: number,
    to: string,
  ) => void
  onCancel: () => void
  isWalletDeployed: boolean
  tokenList: TokenBalanceObject[]
  tokenPrices: Record<string, IPrice>
  chainId: ChainTypesByIdType
  totalUsdBalance: string
  initialValues: {
    asset?: TokenBalanceObject
    amount?: number
    recipient?: ContactWithAddressRequired
  }
  status?: string
  contactList?: Contact[]
}

interface FormValues {
  amount: number
  to: {
    address: string
    displayAddress: string
  }
  isToValid: boolean
  name: string | null
}

export type ProposedContact = Omit<Contact, 'name'>

const bitcoinFeeMap = new Map([
  [TokenSymbol.BTC, true],
  [TokenSymbol.BTCT, true],
])

const rifFeeMap = new Map([
  [TokenSymbol.TRIF, true],
  [TokenSymbol.RIF, true],
  [TokenSymbol.USDRIF, true],
])

const transactionSchema = yup.object().shape({
  amount: yup.number().min(0.000000001),
  to: yup.object({
    address: yup.string().required(),
    displayAddress: yup.string().notRequired(),
  }),
  balance: yup.string(),
  isToValid: yup.boolean().isTrue(),
})

const maxAmount = 99999999

export const TransactionForm = ({
  initialValues,
  tokenList,
  chainId,
  tokenPrices,
  isWalletDeployed,
  onConfirm,
  onCancel,
  totalUsdBalance,
  status,
  contactList,
}: Props) => {
  const insets = useSafeAreaInsets()
  const { recipient, asset, amount: initialAmount } = initialValues
  const { t } = useTranslation()
  const [showTxSelector, setShowTxSelector] = useState(false)
  const [showTxFeeSelector, setShowTxFeeSelector] = useState(false)
  const [selectedToken, setSelectedToken] = useState<TokenBalanceObject>(
    asset || tokenList[0],
  )
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<
    string | undefined
  >(selectedToken.contractAddress)

  const [selectedFeeToken, setSelectedFeeToken] =
    useState<TokenBalanceObject>(selectedToken)
  const scrollViewRef = useRef<ScrollView>()

  const methods = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      amount: initialAmount || 0,
      to: {
        address: recipient?.address ?? '',
        displayAddress: recipient?.displayAddress ?? '',
      },
      name: recipient?.name ?? null,
      isToValid: !!recipient?.name,
    },
    resolver: yupResolver(transactionSchema),
  })
  const { setValue, handleSubmit, resetField, watch } = methods

  // watch change in form values
  const amount = watch('amount')
  const to = watch('to')
  const hasEnoughBalance = Number(selectedToken.balance) < amount

  const [firstBalance, setFirstBalance] = useState<CurrencyValue>({
    balance: '',
    symbolType: 'icon',
    symbol: selectedToken.symbol,
  })
  const [secondBalance, setSecondBalance] = useState<CurrencyValue>({
    balance: '0',
    symbolType: 'usd',
    symbol: '',
  })
  const [balanceInverted, setBalanceInverted] = useState(false)
  const [proposedContact, setProposedContact] =
    useState<ProposedContact | null>(null)

  const tokenQuote = selectedToken.contractAddress.startsWith('BITCOIN')
    ? tokenPrices.BTC.price
    : tokenPrices[selectedToken.contractAddress]?.price

  const tokenFeeList = selectedToken.contractAddress.startsWith('BITCOIN')
    ? [selectedToken]
    : tokenList.filter(tk => rifFeeMap.get(tk.symbol as TokenSymbol))

  const handleAmountChange = useCallback(
    (newAmount: string, _balanceInverted: boolean) => {
      const text = sanitizeMaxDecimalText(sanitizeDecimalText(newAmount))
      if (Number(text) >= maxAmount) {
        return
      }
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
          balance: convertTokenToUSD(numberAmount, tokenQuote).toFixed(2),
        }))
      }
    },
    [setValue, tokenQuote],
  )

  const handleTargetAddressChange = useCallback(
    (address: string, displayAddress: string, isValid: boolean) => {
      setValue('to', { address, displayAddress })
      setValue('isToValid', isValid)
    },
    [setValue],
  )

  const handleConfirmClick = useCallback(
    (values: FormValues) => {
      onConfirm(
        selectedToken,
        selectedFeeToken,
        values.amount,
        values.to.address,
      )
    },
    [onConfirm, selectedToken, selectedFeeToken],
  )

  const onChangeSelectedTokenAddress = useCallback(
    (address: string | undefined) => {
      if (address !== selectedTokenAddress) {
        const token = tokenList.filter(
          ({ contractAddress }) => contractAddress === address,
        )[0]
        setSelectedTokenAddress(address)
        setSelectedToken(oldToken => {
          // Reset address when token type is changed
          if ('isBitcoin' in oldToken === !('isBitcoin' in token)) {
            handleTargetAddressChange('', '', false)
          }
          return token
        })
        const tokenObject: CurrencyValue = {
          balance: '0',
          symbol: token.symbol,
          symbolType: 'icon',
        }

        if (balanceInverted) {
          setSecondBalance(tokenObject)
        } else {
          setFirstBalance(tokenObject)
        }

        setSelectedFeeToken(token)
        handleAmountChange('', balanceInverted)
        setShowTxSelector(false)
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
        // round the balance as input precision is 6 decimal places
        secondBalance.balance = roundBalance(
          Number(secondBalance.balance),
          6,
        ).toString()
        handleAmountChange(secondBalance.balance, !prevInverted)
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
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [])

  const onChangeSelectedFee = useCallback(
    (fee: string | undefined) => {
      if (fee) {
        setSelectedFeeToken(
          tokenList.filter(value => value.contractAddress === fee)[0],
        )
        setShowTxFeeSelector(false)
      }
    },
    [tokenList],
  )

  const onAddContact = useCallback(() => {
    if (proposedContact) {
      const { address, displayAddress } = proposedContact
      navigationContainerRef.navigate(rootTabsRouteNames.Contacts, {
        screen: contactsStackRouteNames.ContactForm,
        params: {
          initialValue: {
            name: '',
            displayAddress,
            address,
          },
          proposed: true,
        },
      })
      setProposedContact(null)
    }
  }, [proposedContact])

  return (
    <>
      <ScrollView ref={scrollViewRef} scrollIndicatorInsets={{ right: -8 }}>
        <FormProvider {...methods}>
          {recipient?.name ? (
            <Input
              isReadOnly
              label={t('transaction_form_recepient_label')}
              value={recipient.name}
              subtitle={
                recipient.displayAddress || shortAddress(recipient.address)
              }
              inputName={'to'}
              leftIcon={<Avatar name={recipient.name} size={32} />}
            />
          ) : (
            <AddressInput
              label={t('transaction_form_recepient_label')}
              placeholder={t('transaction_form_recepient_label')}
              inputName={'to'}
              value={to}
              onChangeAddress={handleTargetAddressChange}
              resetValue={() => {
                resetField('to')
                resetField('isToValid')
                setProposedContact(null)
              }}
              testID={'To.Input'}
              chainId={chainId}
              isBitcoin={'satoshis' in selectedToken}
              contactList={contactList}
              onAddContact={setProposedContact}
            />
          )}
          {proposedContact ? (
            <AppButton
              style={styles.proposedContact}
              testID={`${testIDs.addressInput}.Button.ProposedContact`}
              accessibilityLabel="addProposedContact"
              title={`${t('contact_form_button_add_proposed_contact')} ${
                proposedContact.displayAddress
              } ${t('contact_form_button_add_proposed_contact_ending')}`}
              onPress={onAddContact}
            />
          ) : null}
          <TokenBalance
            style={styles.marginTop10}
            firstValue={firstBalance}
            secondValue={secondBalance}
            color={sharedColors.black}
            error={hasEnoughBalance ? t('transaction_form_error_balance') : ''}
            onSwap={onSwapBalance}
            editable
            handleAmountChange={value => {
              handleAmountChange(value, balanceInverted)
            }}
          />
          <Input
            containerStyle={styles.marginTop10}
            inputName={'balance'}
            label={`${selectedToken.symbol} ${t(
              'transaction_form_balance_label',
            )}`}
            placeholder={`${selectedToken.balance} ${selectedToken.symbol}`}
            isReadOnly
          />
          <AppTouchable
            width={'100%'}
            onPress={toggleShowTx}
            accessibilityLabel={'ChangeTxAsset'}
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
              totalUsdBalance={totalUsdBalance}
              showTotalCard={false}
            />
          ) : null}
          {firstBalance.balance ? (
            <Input
              inputName={'fee'}
              label={t('transaction_form_fee_input_label')}
              placeholder={selectedFeeToken.symbol}
              leftIcon={
                <TokenImage symbol={selectedFeeToken.symbol} size={32} />
              }
              isReadOnly
            />
          ) : null}
          {firstBalance.balance && tokenFeeList.length > 1 ? (
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
              totalUsdBalance={totalUsdBalance}
              showTotalCard={false}
            />
          ) : null}
        </FormProvider>
      </ScrollView>
      <View style={[styles.marginTop10, { paddingBottom: insets.bottom }]}>
        {status && (
          <Typography style={styles.statusText} type="h4">
            {status}
          </Typography>
        )}
        <AppButton
          title={`${t('transaction_form_button_send')} ${amount} ${
            selectedToken.symbol
          }`}
          onPress={handleSubmit(handleConfirmClick)}
          accessibilityLabel={'Send'}
          disabled={
            !selectedTokenAddress ||
            !isWalletDeployed ||
            Number(selectedToken.balance) <= 0 ||
            to.address.length === 0 ||
            amount === 0 ||
            hasEnoughBalance
          }
          color={sharedColors.white}
          textColor={sharedColors.black}
        />
        <AppButton
          style={styles.buttonCancel}
          title={t('transaction_form_button_cancel')}
          onPress={onCancel}
          accessibilityLabel={'Cancel'}
          backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  marginTop10: castStyle.view({
    marginTop: 10,
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
  statusText: castStyle.text({
    marginBottom: 10,
    textAlign: 'center',
  }),
  proposedContact: castStyle.view({ marginTop: 6 }),
})
