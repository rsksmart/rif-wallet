import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useTranslation } from 'react-i18next'

import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { ContactWithAddressRequired } from 'shared/types'
import { TokenBalance, CurrencyValue } from 'components/token'
import { Typography } from 'components/typography'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import {
  AppButton,
  AppButtonProps,
  AppButtonWidthVarietyEnum,
} from 'components/button'

export enum TransactionStatus {
  CONFIRMED = 'confirmed',
}

const transactionStatusToIconPropsMap = new Map([
  [
    TransactionStatus.CONFIRMED,
    {
      iconName: 'check-circle',
      iconColor: sharedColors.successLight,
    },
  ],
  [undefined, null],
])

export interface TransactionSummaryScreenProps {
  transaction: {
    tokenValue: CurrencyValue
    usdValue: CurrencyValue
    status?: TransactionStatus
  }
  contact: ContactWithAddressRequired
  buttons?: AppButtonProps[]
}

export const TransactionsSummary = ({
  route,
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.TransactionSummary>) => {
  const { t } = useTranslation()
  const transaction = route.params.transaction
  const contact = route.params.contact
  const buttons = route.params.buttons

  const iconObject = transactionStatusToIconPropsMap.get(transaction.status)

  return (
    <View style={styles.screen}>
      <Typography
        style={styles.sendText}
        type={'h4'}
        color={sharedColors.inputLabelColor}>
        {t('transaction_summary_title')}
      </Typography>
      <TokenBalance
        style={styles.tokenBalance}
        firstValue={transaction.tokenValue}
        secondValue={transaction.usdValue}
        to={contact}
      />
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
            {transaction.status ? transaction.status : ''}
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
      <AppButton
        title={t('transaction_summary_button_usd')}
        style={styles.usdButton}
        widthVariety={AppButtonWidthVarietyEnum.INLINE}
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
            {'43.20'}
          </Typography>
          <Typography
            type={'h4'}
            style={[styles.summaryText, sharedStyles.textRight]}>
            {'43.20'}
          </Typography>
          <Typography
            type={'h4'}
            style={[styles.summaryText, sharedStyles.textRight]}>
            {'0.20'}
          </Typography>
          <Typography
            type={'h4'}
            style={[styles.summaryText, sharedStyles.textRight]}>
            {'approx. 1 min'}
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
          type={'h4'}
          style={[styles.summaryText, sharedStyles.textRight]}>
          {contact.address}
        </Typography>
      </View>
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
            onPress={() => navigation.goBack()}
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
  sendText: castStyle.text({ marginTop: 22 }),
  tokenBalance: castStyle.view({ marginTop: 9 }),
  statusContainer: castStyle.view({
    height: 54,
    marginTop: 28,
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
  }),
  summaryWrapper: castStyle.view({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: sharedColors.white,
    paddingBottom: 16,
  }),
  summaryText: castStyle.text({
    marginTop: 12,
  }),
  buttons: castStyle.view({
    position: 'absolute',
    bottom: 30,
    left: 22,
    right: 22,
  }),
  statusIcon: castStyle.text({ marginLeft: 10 }),
  nextButton: castStyle.view({ marginTop: 10 }),
})
