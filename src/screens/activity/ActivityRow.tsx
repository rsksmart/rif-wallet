import React from 'react'
import { ActivityMixedType } from './types'
import ActivityRowPresentation from './ActivityRowPresentation'
import useActivityDeserializer from './useActivityDeserializer'
import { RootStackNavigationProp } from 'navigation/rootNavigator/types'

interface Interface {
  activityTransaction: ActivityMixedType
  navigation: RootStackNavigationProp
}

const ActivityRow: React.FC<Interface> = ({
  activityTransaction,
  navigation,
}) => {
  const activityDetails = useActivityDeserializer(activityTransaction)
  const handlePress = () =>
    navigation.navigate('ActivityDetails', activityTransaction as any)

  return <ActivityRowPresentation {...activityDetails} onPress={handlePress} />
}

export default ActivityRow
