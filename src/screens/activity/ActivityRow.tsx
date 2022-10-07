import React from 'react'
import { ActivityMixedType } from './types'
import ActivityRowPresentation from './ActivityRowPresentation'
import useActivityDeserializer from './useActivityDeserializer'

interface Interface {
  activityTransaction: ActivityMixedType
  navigation: any
}

const ActivityRow: React.FC<Interface> = ({
  activityTransaction,
  navigation,
}) => {
  const activityDetails = useActivityDeserializer(activityTransaction)
  const handlePress = () =>
    navigation.navigate('ActivityDetails', activityTransaction)

  return <ActivityRowPresentation {...activityDetails} onPress={handlePress} />
}

export default ActivityRow
