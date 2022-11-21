import { ActivityMixedType } from './types'
import ActivityRowPresentation from './ActivityRowPresentation'
import useActivityDeserializer from './useActivityDeserializer'
import {
  RootStackNavigationProp,
  rootStackRouteNames,
} from 'navigation/rootNavigator/types'

interface Props {
  activityTransaction: ActivityMixedType
  navigation: RootStackNavigationProp
}

const ActivityRow = ({ activityTransaction, navigation }: Props) => {
  const activityDetails = useActivityDeserializer(activityTransaction)
  const handlePress = () =>
    navigation.navigate(
      rootStackRouteNames.ActivityDetails,
      activityTransaction,
    )

  return <ActivityRowPresentation {...activityDetails} onPress={handlePress} />
}

export default ActivityRow
