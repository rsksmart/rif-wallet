import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'

import { ActivityMixedType } from './types'
import ActivityRowPresentation from './ActivityRowPresentation'
import useActivityDeserializer from './useActivityDeserializer'
import { BasicRow, StatusEnum } from 'components/BasicRow'

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
}
export const ActivityBasicRow = ({
  activityTransaction,
}: ActivityBasicRowProps) => {
  const activityDetails = useActivityDeserializer(activityTransaction)

  return (
    <BasicRow
      label={activityDetails.to}
      amount={activityDetails.value}
      status={getStatus(activityDetails.status)}
      avatarName={'A'}
      secondaryLabel={activityDetails.timeHumanFormatted}
    />
  )
}
