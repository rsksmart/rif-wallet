import { t } from 'i18next'

import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { StatusEnum } from 'components/BasicRow'
import { BasicRowWithContact } from 'components/BasicRow/BasicRowWithContact'
import { AppButtonBackgroundVarietyEnum, AppTouchable } from 'src/components'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import {
  TransactionStatus,
  TransactionSummaryScreenProps,
} from 'screens/transactionSummary'
import { useAppSelector } from 'store/storeUtils'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { selectSelectedWallet, selectWallets } from 'store/slices/settingsSlice'
import { sharedColors } from 'shared/constants'

import useActivityDeserializer from './useActivityDeserializer'
import ActivityRowPresentation from './ActivityRowPresentation'
import { ActivityMixedType } from './types'

interface Props extends RootTabsScreenProps<rootTabsRouteNames.Activity> {
  activityTransaction: ActivityMixedType
}

export const ActivityRow = ({ activityTransaction, navigation }: Props) => {
  const prices = useAppSelector(selectUsdPrices)
  const selectedWallet = useAppSelector(selectSelectedWallet)
  const wallets = useAppSelector(selectWallets)
  const activityDetails = useActivityDeserializer(
    activityTransaction,
    prices,
    wallets[selectedWallet],
  )
  const txSummary: TransactionSummaryScreenProps = {
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
      status:
        activityDetails.status === 'success'
          ? TransactionStatus.CONFIRMED
          : undefined,
      feeValue: activityDetails.fee,
      total: activityDetails.total,
      time: activityDetails.timeHumanFormatted,
    },
    contact: {
      address: activityDetails.to,
    },
    title: 'Sent',
    buttons: [
      {
        title: t('transaction_summary_default_button_text'),
        color: sharedColors.white,
        textColor: sharedColors.black,
        backgroundVariety: AppButtonBackgroundVarietyEnum.DEFAULT,
        onPress: () => {
          navigation.navigate(rootTabsRouteNames.Activity)
        },
      },
    ],
  }
  const handlePress = () => {
    navigation.navigate(rootTabsRouteNames.TransactionSummary, txSummary)
  }
  return <ActivityRowPresentation {...activityDetails} onPress={handlePress} />
}
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
  navigation: HomeStackScreenProps<homeStackRouteNames.Main>['navigation']
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
  const txSummary: TransactionSummaryScreenProps = {
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
      status:
        activityDetails.status === 'success'
          ? TransactionStatus.CONFIRMED
          : undefined,
      feeValue: activityDetails.fee,
      total: activityDetails.total,
      time: activityDetails.timeHumanFormatted,
    },
    contact: {
      address: activityDetails.to,
    },
    title: 'Sent',
  }
  const handlePress = () =>
    navigation.navigate(rootTabsRouteNames.TransactionSummary, txSummary)
  return (
    <AppTouchable width={'100%'} onPress={handlePress}>
      <BasicRowWithContact
        label={activityDetails.to}
        amount={activityDetails.value}
        status={getStatus(activityDetails.status)}
        avatar={{
          name: 'A',
        }}
        secondaryLabel={activityDetails.timeHumanFormatted}
        addressToSearch={activityDetails.to}
      />
    </AppTouchable>
  )
}
