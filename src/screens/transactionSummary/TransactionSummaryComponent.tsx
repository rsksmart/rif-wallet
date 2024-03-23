import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { isBitcoinAddressValid } from '@rsksmart/rif-wallet-bitcoin'

import { TokenBalance } from 'components/token'
import {
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  sharedColors,
  sharedStyles,
} from 'shared/constants'
import { castStyle, formatTokenValue, formatFiatValue } from 'shared/utils'
import { AppButton, AppTouchable, Typography } from 'components/index'
import { useAppSelector } from 'store/storeUtils'
import { isMyAddress } from 'components/address/lib'
import { FullScreenSpinner } from 'components/fullScreenSpinner'
import { getContactByAddress } from 'store/slices/contactsSlice'
import { getWalletSetting } from 'core/config'
import { SETTINGS } from 'core/types'
import { selectChainId } from 'store/slices/settingsSlice'
import { TransactionStatus } from 'store/shared/types'

import { TokenImage } from '../home/TokenImage'
import {
  transactionStatusDisplayText,
  transactionStatusToIconPropsMap,
} from './transactionSummaryUtils'

import { TransactionSummaryScreenProps } from '.'

interface Props {
  address: string
  goBack?: () => void
}

type TransactionSummaryComponentProps = Omit<
  TransactionSummaryScreenProps,
  'backScreen'
> &
  Props

export const TransactionSummaryComponent = ({
  address,
  transaction,
  buttons,
  functionName,
  goBack,
  isLoaded,
  FeeComponent,
}: TransactionSummaryComponentProps) => {
  const [confirmed, setConfirmed] = useState(false)
  const chainId = useAppSelector(selectChainId)
  const { bottom } = useSafeAreaInsets()
  const { t } = useTranslation()
  const {
    status,
    tokenValue,
    fee,
    usdValue,
    time,
    hashId,
    to,
    from,
    totalToken,
    totalUsd,
  } = transaction

  const iconObject = transactionStatusToIconPropsMap.get(status)
  const transactionStatusText = transactionStatusDisplayText.get(status)

  const amIReceiver = transaction.amIReceiver ?? isMyAddress(address, to)
  const contactAddress = amIReceiver ? from || '' : to
  const contact = useAppSelector(
    getContactByAddress(contactAddress.toLowerCase()),
  )
  const contactToUse = contact || { address: contactAddress }

  const title = useMemo(() => {
    if (amIReceiver) {
      if (status === TransactionStatus.SUCCESS) {
        return t('transaction_summary_received_title_success')
      } else if (status === TransactionStatus.PENDING) {
        return t('transaction_summary_received_title_pending')
      }
      return t('transaction_summary_receive_title')
    }
    if (status === TransactionStatus.SUCCESS) {
      return t('transaction_summary_sent_title_success')
    } else if (status === TransactionStatus.PENDING) {
      return t('transaction_summary_sent_title_pending')
    }
    return t('transaction_summary_send_title')
  }, [amIReceiver, t, status])

  const openTransactionHash = () => {
    const setting = isBitcoinAddressValid(to)
      ? SETTINGS.BTC_EXPLORER_ADDRESS_URL
      : SETTINGS.EXPLORER_ADDRESS_URL

    const explorerUrl = getWalletSetting(setting, chainId)
    Linking.openURL(`${explorerUrl}/${hashId}`)
  }

  return (
    <View style={[styles.screen, { paddingBottom: bottom }]}>
      {isLoaded === false && <FullScreenSpinner />}
      <ScrollView
        style={sharedStyles.flex}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}>
        <Typography
          style={styles.title}
          type={'h4'}
          color={sharedColors.inputLabelColor}>
          {title}
        </Typography>
        <TokenBalance
          firstValue={tokenValue}
          secondValue={usdValue}
          contact={contactToUse}
          amIReceiver={amIReceiver}
        />
        {functionName && (
          <Typography
            style={styles.title}
            type={'body1'}
            color={sharedColors.inputLabelColor}>
            {t('transaction_summary_function_type')}: {functionName}
          </Typography>
        )}
        <View />
        {transactionStatusText || status ? (
          <View
            style={[
              styles.summaryAlignment,
              styles.statusContainer,
              status ? { backgroundColor: sharedColors.inputInactive } : null,
            ]}>
            <Typography type={'h4'}>
              {status ? t('transaction_summary_status') : ''}
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
        <View style={styles.summaryView}>
          {/* fee values */}
          {status !== TransactionStatus.PENDING && (
            <>
              <View style={styles.summaryAlignment}>
                <Typography type={'body2'} style={[sharedStyles.textLeft]}>
                  {t('transaction_summary_fees')}
                </Typography>

                <View style={sharedStyles.row}>
                  <TokenImage
                    symbol={fee.symbol || tokenValue.symbol}
                    transparent
                    size={12}
                  />
                  <Typography type={'body2'} style={[sharedStyles.textCenter]}>
                    {formatTokenValue(fee.tokenValue)} {fee.symbol}
                  </Typography>
                </View>
              </View>

              <View style={styles.dollarAmountWrapper}>
                <Typography
                  type={'body2'}
                  style={[
                    sharedStyles.textRight,
                    { color: sharedColors.labelLight },
                  ]}>
                  {formatFiatValue(fee.usdValue)}
                </Typography>
              </View>
            </>
          )}
          {FeeComponent}
          {/* Total values */}
          <View style={[styles.summaryAlignment]}>
            <Typography type={'body2'} style={[sharedStyles.textLeft]}>
              {amIReceiver
                ? status === TransactionStatus.SUCCESS
                  ? t('transaction_summary_i_received_text')
                  : t('transaction_summary_i_receive_text')
                : status === TransactionStatus.SUCCESS
                ? t('transaction_summary_total_sent')
                : t('transaction_summary_total_send')}
            </Typography>

            <View style={sharedStyles.row}>
              <TokenImage symbol={tokenValue.symbol} size={12} transparent />
              <Typography type={'body2'} style={[sharedStyles.textCenter]}>
                {formatTokenValue(totalToken)} {tokenValue.symbol}{' '}
                {tokenValue.symbol !== fee.symbol &&
                  !amIReceiver &&
                  t('transaction_summary_plus_fees')}
              </Typography>
            </View>
          </View>
          <View style={styles.dollarAmountWrapper}>
            <Typography
              type={'body2'}
              style={[
                sharedStyles.textRight,
                { color: sharedColors.labelLight },
              ]}>
              {formatFiatValue(totalUsd)}
            </Typography>
          </View>
          {/* arrive value */}
          <View style={[styles.summaryAlignment]}>
            <Typography type={'body2'} style={[sharedStyles.textLeft]}>
              {status === TransactionStatus.SUCCESS
                ? t('transaction_summary_arrived_text')
                : t('transaction_summary_arrives_in_text')}
            </Typography>

            <Typography type={'body2'} style={[sharedStyles.textRight]}>
              {time}
            </Typography>
          </View>
          {/* separator */}
          <View style={styles.separator} />
          {/* address value */}
          {contactToUse?.name && (
            <View style={[styles.summaryAlignment]}>
              <Typography
                type={'body2'}
                style={[sharedStyles.textLeft, sharedStyles.flex]}>
                {t('transaction_summary_address_text')}
              </Typography>
              <Typography
                type={'h5'}
                style={[sharedStyles.textRight, styles.fullAddress]}
                numberOfLines={1}
                ellipsizeMode={'middle'}>
                {contactToUse.address}
              </Typography>
            </View>
          )}
          {/* transaction hash */}
          {hashId && (
            <View style={[styles.summaryAlignment]}>
              <Typography
                type={'body2'}
                style={[sharedStyles.textLeft, sharedStyles.flex]}>
                {t('transaction_summary_transaction_hash')}
              </Typography>
              <AppTouchable
                width="100%"
                onPress={openTransactionHash}
                style={styles.fullAddress}>
                <Typography
                  type={'h5'}
                  style={[sharedStyles.textRight, styles.underline]}
                  numberOfLines={1}
                  ellipsizeMode={'middle'}
                  accessibilityLabel="Hash">
                  {hashId}
                </Typography>
              </AppTouchable>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttons}>
        {buttons ? (
          buttons.map((b, i) => {
            if (i === 0) {
              return (
                <AppButton
                  {...b}
                  onPress={event => {
                    b.onPress?.(event)
                    setConfirmed(true)
                  }}
                  disabled={b.disabled || confirmed}
                  loading={confirmed}
                  key={b.title}
                />
              )
            }
            return <AppButton {...b} key={b.title} />
          })
        ) : (
          <AppButton
            onPress={goBack}
            title={t('transaction_summary_default_button_text')}
            color={sharedColors.white}
            textColor={sharedColors.black}
            accessibilityLabel="Close"
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
  title: castStyle.text({
    marginTop: 22,
  }),
  statusContainer: castStyle.view({
    height: 54,
    marginTop: 27,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 18,
  }),
  summaryView: castStyle.view({
    marginTop: 100,
  }),
  summaryAlignment: castStyle.view({
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  summaryWrapper: castStyle.view({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: sharedColors.white,
    paddingBottom: 16,
  }),
  separator: castStyle.view({
    marginTop: 16,
    height: 1,
    width: '100%',
    backgroundColor: sharedColors.white,
    opacity: 0.4,
  }),
  fullAddress: castStyle.view({
    flex: 3,
    alignSelf: 'flex-end',
  }),
  underline: castStyle.text({
    textDecorationLine: 'underline',
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
  dollarAmountWrapper: castStyle.view({
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
  }),
})
