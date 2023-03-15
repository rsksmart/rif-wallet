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

import useActivityDeserializer from './useActivityDeserializer'
import ActivityRowPresentation from './ActivityRowPresentation'
import { ActivityMixedType } from './types'

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
