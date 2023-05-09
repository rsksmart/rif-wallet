import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { roundBalance } from 'lib/utils'

import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'src/ux/slides/Dimensions'
import { useAppSelector } from 'store/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import {
  AppButton,
  AppButtonProps,
  AppButtonWidthVarietyEnum,
  AppSpinner,
  getAddressDisplayText,
  Typography,
} from 'src/components'
import {
  sharedColors,
  sharedStyles as sharedStylesConstants,
  sharedStyles,
} from 'shared/constants'
import { CurrencyValue, TokenBalance } from 'components/token'
import { ContactWithAddressRequired } from 'shared/types'
import { castStyle } from 'shared/utils'

import {
  TransactionStatus,
  transactionStatusDisplayText,
  transactionStatusToIconPropsMap,
} from './transactionSummaryUtils'

export interface TransactionSummaryScreenProps {
  transaction: {
    tokenValue: CurrencyValue
    usdValue: CurrencyValue
    feeValue: string
    total: string
    time: string
    status?: TransactionStatus
  }
  contact: ContactWithAddressRequired
  buttons?: AppButtonProps[]
  title?: string
  functionName?: string
  goBack?: () => void
  isLoaded?: boolean
}

export const TransactionSummaryComponent = ({
  transaction,
  contact,
  title,
  buttons,
  functionName,
  goBack,
  isLoaded,
}: TransactionSummaryScreenProps) => {
  const { bottom } = useSafeAreaInsets()
  const [usdButtonActive, setUsdButtonActive] = useState(false)
  const { t } = useTranslation()
  const { wallet, chainType } = useAppSelector(selectActiveWallet)

  const iconObject = transactionStatusToIconPropsMap.get(transaction.status)
  const transactionStatusText = transactionStatusDisplayText.get(
    transaction.status,
  )

  const amIReceiver = useMemo(() => {
    if (wallet && chainType) {
      const myAddress = getAddressDisplayText(
        wallet.smartWalletAddress,
        chainType,
      ).checksumAddress

      return myAddress.toLowerCase() === contact.address.toLowerCase()
    }
    return false
  }, [wallet, chainType, contact.address])

  const onToggleUSD = useCallback(() => {
    setUsdButtonActive(prev => !prev)
  }, [])

  return (
    <View style={[styles.screen, { paddingBottom: bottom }]}>
      {isLoaded === false && (
        <View style={[sharedStylesConstants.contentCenter, styles.spinnerView]}>
          <AppSpinner size={64} thickness={10} />
        </View>
      )}
      <ScrollView
        style={sharedStyles.flex}
        contentContainerStyle={styles.contentPadding}>
        <Typography
          style={styles.sendText}
          type={'h4'}
          color={sharedColors.inputLabelColor}>
          {title || t('transaction_summary_title')}
        </Typography>
        <TokenBalance
          firstValue={transaction.tokenValue}
          secondValue={transaction.usdValue}
          to={contact}
        />
        {functionName && (
          <Typography
            style={styles.sendText}
            type={'body1'}
            color={sharedColors.inputLabelColor}>
            {t('transaction_summary_function_type')}: {functionName}
          </Typography>
        )}
        {transactionStatusText || transaction.status ? (
          <View
            style={[
              styles.summaryAlignment,
              styles.statusContainer,
              transaction.status
                ? { backgroundColor: sharedColors.inputInactive }
                : null,
            ]}>
            <Typography type={'h4'}>
              {transaction.status ? t('transaction_summary_status') : ''}
            </Typography>
            <View style={sharedStyles.row}>
              <Typography type={'h4'}>
                {transactionStatusText ? t(transactionStatusText) : ''}
              </Typography>
              {iconObject ? (
                <Icon
                  style={styles.statusIcon}
                  solid
                  size={18}
                  name={iconObject.iconName}
                  color={iconObject.iconColor}
                />
              ) : null}
            </View>
          </View>
        ) : null}
        <AppButton
          title={t('transaction_summary_button_usd')}
          style={styles.usdButton}
          widthVariety={AppButtonWidthVarietyEnum.INLINE}
          color={usdButtonActive ? sharedColors.white : undefined}
          textColor={usdButtonActive ? sharedColors.black : undefined}
          onPress={onToggleUSD}
        />
        <View style={[styles.summaryAlignment, styles.summaryWrapper]}>
          <View>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textLeft]}>
              {amIReceiver
                ? t('transaction_summary_i_receive_text')
                : t('transaction_summary_they_receive_text')}
            </Typography>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textLeft]}>
              {amIReceiver
                ? t('transaction_summary_they_sent_text')
                : t('transaction_summary_you_sent_text')}
            </Typography>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textLeft]}>
              {t('transaction_summary_fee_text')}
            </Typography>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textLeft]}>
              {transaction.status === TransactionStatus.SUCCESS
                ? t('transaction_summary_arrived_text')
                : t('transaction_summary_arrives_in_text')}
            </Typography>
          </View>
          <View>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textRight]}>
              {usdButtonActive
                ? `${transaction.usdValue.symbol}${roundBalance(
                    +transaction.usdValue.balance,
                    2,
                  )}`
                : `${transaction.tokenValue.symbol} ${transaction.tokenValue.balance}`}
            </Typography>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textRight]}>
              {usdButtonActive
                ? `${transaction.usdValue.symbol}${roundBalance(
                    +transaction.usdValue.balance,
                    2,
                  )}`
                : `${transaction.tokenValue.symbol} ${transaction.total}`}
            </Typography>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textRight]}>
              {transaction.feeValue}
            </Typography>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textRight]}>
              {transaction.time}
            </Typography>
          </View>
        </View>
        <View style={styles.summaryAlignment}>
          <Typography
            type={'h4'}
            style={[styles.summaryText, sharedStyles.textLeft]}>
            {t('transaction_summary_address_text')}
          </Typography>
          <Typography
            type={'label'}
            style={[styles.summaryText, sharedStyles.textRight]}>
            {contact.address}
          </Typography>
        </View>
      </ScrollView>
      <View style={styles.buttons}>
        {buttons ? (
          buttons.map(b => (
            <AppButton
              key={b.title}
              onPress={b.onPress}
              title={b.title}
              color={b.color}
              textColor={b.textColor}
              backgroundVariety={b.backgroundVariety}
            />
          ))
        ) : (
          <AppButton
            onPress={goBack}
            title={t('transaction_summary_default_button_text')}
            color={sharedColors.white}
            textColor={sharedColors.black}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.black,
    paddingHorizontal: 22,
  }),
  contentPadding: castStyle.view({ paddingBottom: 114 }),
  sendText: castStyle.text({
    marginTop: 22,
  }),
  statusContainer: castStyle.view({
    height: 54,
    marginTop: 27,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 18,
  }),
  usdButton: castStyle.view({
    marginTop: 40,
    marginBottom: 5,
    alignSelf: 'center',
  }),
  summaryAlignment: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: -10,
  }),
  summaryWrapper: castStyle.view({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: sharedColors.white,
    paddingBottom: 16,
  }),
  summaryText: castStyle.text({
    marginTop: 12,
    lineHeight: 17,
  }),
  buttons: castStyle.view({
    justifyContent: 'space-between',
    minHeight: 114,
  }),
  statusIcon: castStyle.text({ marginLeft: 10 }),
  nextButton: castStyle.view({ marginTop: 10 }),
  spinnerView: castStyle.view({
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  }),
})
