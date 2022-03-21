import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { getAddressDisplayText } from '../../components'

interface EventProps {
  to: string
  from: string
  tx: string
  testID?: string
}
export const Event: React.FC<EventProps> = ({ from, to, tx, testID }) => {
  return (
    <View style={styles.event} testID={testID}>
      <Text testID='tx'>Transaction Hash: {getAddressDisplayText(tx).displayAddress}</Text>
      <Text testID='from'>From: {getAddressDisplayText(from).displayAddress}</Text>
      <Text testID='to'>To: {getAddressDisplayText(to).displayAddress}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  event: {
    marginBottom: 10,
  },
})
