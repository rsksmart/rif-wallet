import { useCallback, useMemo } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { roundBalance, shortAddress } from 'lib/utils'

import { StatusEnum } from 'components/BasicRow'
import { BasicRowWithContact } from 'components/BasicRow/BasicRowWithContact'
import { AppTouchable } from 'components/index'
import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { ActivityMainScreenProps } from 'shared/types'
import { castStyle } from 'shared/utils'
import { ActivityRowPresentationObject } from 'store/slices/transactionsSlice'
import { useIsMyAddress } from 'src/components/address/useIsMyAddress'

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
  activityDetails: ActivityRowPresentationObject
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
  const amIReceiver = useIsMyAddress(activityDetails.to)

  const label = useMemo(() => {
    return `${amIReceiver ? 'Received from' : 'Sent to'} ${shortAddress(
      activityDetails.to,
    )}`
  }, [activityDetails.to, amIReceiver])

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
          balance: '' + roundBalance(activityDetails.price, 2),
        },
        status: activityDetails.status,
        feeValue: activityDetails.fee,
        total: activityDetails.total,
        time: activityDetails.timeHumanFormatted,
      },
      contact: {
        address: activityDetails.to,
      },
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
        label={label}
        amount={+activityDetails.value}
        symbol={activityDetails.symbol}
        status={getStatus(activityDetails.status)}
        avatar={{ name: 'A' }}
        secondaryLabel={activityDetails.timeHumanFormatted}
        addressToSearch={activityDetails.to}
      />
    </AppTouchable>
  )
}

const styles = StyleSheet.create({
  component: castStyle.view({
    paddingHorizontal: 6,
  }),
})
