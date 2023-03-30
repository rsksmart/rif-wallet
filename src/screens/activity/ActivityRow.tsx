import { t } from 'i18next'
import { useCallback, useMemo } from 'react'

import { shortAddress } from 'lib/utils'

import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import { StatusEnum } from 'components/BasicRow'
import { BasicRowWithContact } from 'components/BasicRow/BasicRowWithContact'
import { AppTouchable } from 'components/index'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { useAppSelector } from 'store/storeUtils'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { selectSelectedWallet, selectWallets } from 'store/slices/settingsSlice'
import { ActivityMainScreenProps } from 'shared/types'

import useActivityDeserializer from './useActivityDeserializer'
import { ActivityMixedType } from './types'

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

interface ActivityBasicRowProps {
  activityTransaction: ActivityMixedType
  navigation: ActivityMainScreenProps['navigation']
}
export const ActivityBasicRow = ({
  activityTransaction,
  navigation,
}: ActivityBasicRowProps) => {
  const prices = useAppSelector(selectUsdPrices)
  const selectedWallet = useAppSelector(selectSelectedWallet)
  const wallets = useAppSelector(selectWallets)
  const activityDetails = useActivityDeserializer(
    activityTransaction,
    prices,
    wallets[selectedWallet],
  )
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
  const handlePress = useCallback(
    () => navigation.navigate(rootTabsRouteNames.TransactionSummary, txSummary),
    [navigation, txSummary],
  )

  return (
    <AppTouchable width={'100%'} onPress={handlePress}>
      <BasicRowWithContact
        label={shortAddress(activityDetails.to, 8)}
        amount={activityDetails.value}
        status={getStatus(activityDetails.status)}
        avatar={{ name: 'A' }}
        secondaryLabel={activityDetails.timeHumanFormatted}
        addressToSearch={activityDetails.to}
      />
    </AppTouchable>
  )
}
