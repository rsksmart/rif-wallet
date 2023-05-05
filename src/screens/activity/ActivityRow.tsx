import { t } from 'i18next'
import { useCallback, useMemo } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { shortAddress } from 'lib/utils'

import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import { StatusEnum } from 'components/BasicRow'
import { BasicRowWithContact } from 'components/BasicRow/BasicRowWithContact'
import { AppTouchable } from 'components/index'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { ActivityMainScreenProps } from 'shared/types'
import { castStyle } from 'shared/utils'

import { ActivityRowPresentationObjectType } from './types'

const getStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return StatusEnum.PENDING
    case 'failed':
      return StatusEnum.PENDING
    default:
      return undefined
  }
}

interface Props {
  activityDetails: ActivityRowPresentationObjectType
  navigation: ActivityMainScreenProps['navigation']
  backScreen?: rootTabsRouteNames
  style?: StyleProp<ViewStyle>
}

export const ActivityBasicRow = ({
  navigation,
  activityDetails,
  backScreen,
  style,
}: Props) => {
  const txSummary: TransactionSummaryScreenProps = useMemo(
    () => ({
      transaction: {
        tokenValue: {
          symbol: activityDetails.symbol,
          symbolType: 'icon',
          balance: activityDetails.value,
        },
        usdValue: {
          symbol: '$',
          symbolType: 'text',
          balance: '' + activityDetails.price,
        },
        status: activityDetails.status,
        feeValue: activityDetails.fee,
        total: activityDetails.total,
        time: activityDetails.timeHumanFormatted,
      },
      contact: {
        address: activityDetails.to,
      },
      title: t('transaction_summary_sent_title'),
    }),
    [activityDetails],
  )

  const handlePress = useCallback(() => {
    if (txSummary) {
      navigation.navigate(rootTabsRouteNames.TransactionSummary, {
        ...txSummary,
        backScreen,
      })
    }
  }, [navigation, txSummary, backScreen])

  return (
    <AppTouchable
      width={'100%'}
      onPress={handlePress}
      style={[styles.component, style]}>
      <BasicRowWithContact
        label={shortAddress(activityDetails.to, 8)}
        amount={activityDetails.value}
        status={getStatus(activityDetails.status)}
        avatar={{ name: 'A' }}
        secondaryLabel={activityDetails.timeHumanFormatted}
        addressToSearch={activityDetails.to}
        symbol={activityDetails.symbol}
      />
    </AppTouchable>
  )
}

const styles = StyleSheet.create({
  component: castStyle.view({
    paddingHorizontal: 6,
  }),
})
