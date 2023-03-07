import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { ActivityMixedType } from './types'
import ActivityRowPresentation from './ActivityRowPresentation'
import useActivityDeserializer from './useActivityDeserializer'
import { BasicRow, StatusEnum } from 'components/BasicRow'
import { AppTouchable } from 'src/components'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'

interface Props extends RootTabsScreenProps<rootTabsRouteNames.Activity> {
  activityTransaction: ActivityMixedType
}

export const ActivityRow = ({ activityTransaction, navigation }: Props) => {
  const activityDetails = useActivityDeserializer(activityTransaction)
  const handlePress = () =>
    navigation.navigate(rootTabsRouteNames.ActivityDetails, activityTransaction)

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
  const activityDetails = useActivityDeserializer(activityTransaction)
  const handlePress = () =>
    navigation.navigate(rootTabsRouteNames.ActivityDetails, activityTransaction)
  return (
    <AppTouchable width={'100%'} onPress={handlePress}>
      <BasicRow
        label={activityDetails.to}
        amount={activityDetails.value}
        status={getStatus(activityDetails.status)}
        avatarName={'A'}
        secondaryLabel={activityDetails.timeHumanFormatted}
      />
    </AppTouchable>
  )
}
