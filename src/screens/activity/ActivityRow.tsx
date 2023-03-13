import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { StatusEnum } from 'components/BasicRow'
import { BasicRowWithContact } from 'components/BasicRow/BasicRowWithContact'
import { AppTouchable } from 'components/appTouchable'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { TransactionStatus, TransactionSummaryScreenProps } from 'src/screens/transactionSummary'
import { useAppSelector } from 'src/redux/storeUtils'
import { selectUsdPrices } from 'src/redux/slices/usdPricesSlice'


import useActivityDeserializer from './useActivityDeserializer'
import ActivityRowPresentation from './ActivityRowPresentation'
import { ActivityMixedType } from './types'

interface Props extends RootTabsScreenProps<rootTabsRouteNames.Activity> {
  activityTransaction: ActivityMixedType
}

export const ActivityRow = ({ activityTransaction, navigation }: Props) => {
  const prices = useAppSelector(selectUsdPrices)
  const activityDetails = useActivityDeserializer(activityTransaction, prices)
  const txSummary: TransactionSummaryScreenProps = {
    transaction: {
      tokenValue: {
        symbol: activityDetails.symbol,
        symbolType: 'icon',
        balance: activityDetails.value
      },
      usdValue: {
        symbol: '$',
        symbolType: 'text',
        balance: '' + activityDetails.price
      },
      status: (activityDetails.status === 'success' ? TransactionStatus.CONFIRMED : undefined)
    },
    contact:{
      address: activityDetails.to
    }
  }
  const handlePress = () =>
    // navigation.navigate(rootTabsRouteNames.ActivityDetails, activityTransaction)
    navigation.navigate(rootTabsRouteNames.TransactionSummary, txSummary)

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
  const activityDetails = useActivityDeserializer(activityTransaction, prices)
  const txSummary: TransactionSummaryScreenProps = {
    transaction: {
      tokenValue: {
        symbol: activityDetails.symbol,
        symbolType: 'icon',
        balance: activityDetails.value
      },
      usdValue: {
        symbol: '$',
        symbolType: 'text',
        balance: '' + activityDetails.price
      },
      status: (activityDetails.status === 'success' ? TransactionStatus.CONFIRMED : undefined)
    },
    contact:{
      address: activityDetails.to
    }
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
