import React from 'react'
import { View, Text } from 'react-native'

interface FeedbackInterface {}

export const FeedbackScreen: React.FC<FeedbackInterface> = ({}) => {
  return (
    <View>
      <Text>Feedback Form</Text>
    </View>
  )
}
