import { ActivityMixedType } from './types'
import ActivityRowPresentation from './ActivityRowPresentation'
import useActivityDeserializer from './useActivityDeserializer'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'

interface Props extends RootTabsScreenProps<rootTabsRouteNames.Activity> {
  activityTransaction: ActivityMixedType
}

export const ActivityRow = ({ activityTransaction, navigation }: Props) => {
  const activityDetails = useActivityDeserializer(activityTransaction)
  const handlePress = () =>
    navigation.navigate(rootTabsRouteNames.ActivityDetails, activityTransaction)

  return <ActivityRowPresentation {...activityDetails} onPress={handlePress} />
}
