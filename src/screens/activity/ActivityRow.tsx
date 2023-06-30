import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { roundBalance, shortAddress } from 'lib/utils'

import { StatusEnum } from 'components/BasicRow'
import { BasicRowWithContact } from 'components/BasicRow/BasicRowWithContact'
import { AppTouchable } from 'components/appTouchable'
import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { ActivityMainScreenProps } from 'shared/types'
import { castStyle } from 'shared/utils'
import { isMyAddress } from 'src/components/address/lib'
import { selectActiveWallet } from 'src/redux/slices/settingsSlice'
import { useAppSelector } from 'src/redux/storeUtils'
import { ActivityRowPresentationObject } from 'store/slices/transactionsSlice'
import { getContactsAsObject } from 'store/slices/contactsSlice'

const getStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return StatusEnum.PENDING
    case 'failed':
      return StatusEnum.FAILED
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
  const { t } = useTranslation()
  const { wallet } = useAppSelector(selectActiveWallet)
  const contacts = useAppSelector(getContactsAsObject)

  const usdBalance = useMemo(
    () => roundBalance(activityDetails.price, 2),
    [activityDetails.price],
  )

  const amIReceiver = useMemo(
    () =>
      activityDetails.amIReceiver ?? isMyAddress(wallet, activityDetails.to),
    [wallet, activityDetails],
  )
  const label = useMemo(
    () =>
      (amIReceiver ? t('received_from') : t('sent_to')) +
      ' ' +
      shortAddress(amIReceiver ? activityDetails.from : activityDetails.to),
    [activityDetails.from, activityDetails.to, amIReceiver, t],
  )

  const txSummary: TransactionSummaryScreenProps = useMemo(() => {
    const {
      symbol,
      value,
      status,
      fee,
      total,
      timeHumanFormatted,
      from,
      to = '',
    } = activityDetails
    return {
      transaction: {
        tokenValue: {
          symbol,
          symbolType: 'icon',
          balance: value,
        },
        usdValue: {
          symbol: usdBalance ? '$' : '< $',
          symbolType: 'usd',
          balance: usdBalance ? usdBalance.toFixed(2) : '0.01',
        },
        status,
        fee,
        total,
        amIReceiver,
        from,
        time: timeHumanFormatted,
      },
      contact: contacts[to.toLowerCase()] || { address: to },
    }
  }, [activityDetails, amIReceiver, contacts, usdBalance])

  const amount = useMemo(() => {
    const value = +activityDetails.value
    let rounded = roundBalance(value, 4)
    if (!rounded) {
      rounded = roundBalance(value, 8)
    }
    return rounded.toString()
  }, [activityDetails.value])

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
        amount={amount}
        symbol={activityDetails.symbol}
        status={getStatus(activityDetails.status)}
        avatar={{ name: 'A' }}
        secondaryLabel={activityDetails.timeHumanFormatted}
        addressToSearch={activityDetails.to}
        usdAmount={usdBalance.toFixed(2)}
      />
    </AppTouchable>
  )
}

const styles = StyleSheet.create({
  component: castStyle.view({
    paddingHorizontal: 6,
  }),
})
