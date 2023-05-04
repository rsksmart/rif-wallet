import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { roundBalance } from 'lib/utils'

import {
  AppButton,
  AppButtonProps,
  AppButtonWidthVarietyEnum,
} from 'components/button'
import { CurrencyValue, TokenBalance } from 'components/token'
import { Typography } from 'components/typography'
import {
  RootTabsScreenProps,
  rootTabsRouteNames,
} from 'navigation/rootNavigator'
import { sharedColors, sharedStyles } from 'shared/constants'
import { ContactWithAddressRequired } from 'shared/types'
import { castStyle } from 'shared/utils'
import { setFullscreen } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'

export enum TransactionStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
}

const transactionStatusToIconPropsMap = new Map([
  [
    TransactionStatus.SUCCESS,
    {
      iconName: 'check-circle',
      iconColor: sharedColors.successLight,
      displayText: 'confirmed',
    },
  ],
  [undefined, null],
])
const transactionStatusDisplayText = new Map([
  [TransactionStatus.SUCCESS, 'transaction_confirmed_status'],
  [TransactionStatus.PENDING, 'transaction_pending_status'],
  [undefined, ''],
])

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
  backScreen?: rootTabsRouteNames
}

export const TransactionSummary = ({
  route,
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.TransactionSummary>) => {
  const { bottom } = useSafeAreaInsets()
  const [usdButtonActive, setUsdButtonActive] = useState(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()
  const { transaction, contact, title, buttons, backScreen } = route.params

  const iconObject = transactionStatusToIconPropsMap.get(transaction.status)
  const transactionStatusText = transactionStatusDisplayText.get(
    transaction.status,
  )

  const goBack = useMemo(() => {
    if (backScreen) {
      return () => navigation.navigate(backScreen)
    }
    return navigation.goBack
  }, [backScreen, navigation])

  const onToggleUSD = useCallback(() => {
    setUsdButtonActive(prev => !prev)
  }, [])

  useEffect(() => {
    dispatch(setFullscreen(isFocused))
  }, [dispatch, isFocused])

  /* override hard back button */
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        goBack()
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [goBack]),
  )

  return (
    <View style={[styles.screen, { paddingBottom: bottom }]}>
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
              {t('transaction_summary_receive_text')}
            </Typography>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textLeft]}>
              {t('transaction_summary_send_text')}
            </Typography>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textLeft]}>
              {t('transaction_summary_fee_text')}
            </Typography>
            <Typography
              type={'h4'}
              style={[styles.summaryText, sharedStyles.textLeft]}>
              {t('transaction_summary_arrives_text')}
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
})
