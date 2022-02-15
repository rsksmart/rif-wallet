import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import ActivityRow from '../activity/ActivityRow'

interface Interface {
  visible: boolean
  setPanelActive: () => void
  navigation: any
}

const PendingActivityComponent: React.FC<Interface> = ({
  visible,
  setPanelActive,
  navigation,
}) => {
  const { state } = useSocketsState()

  const recent = state.pendingTransactions
  return (
    <ScrollView style={styles.portfolio}>
      <TouchableOpacity onPress={setPanelActive} disabled={visible}>
        <Text style={styles.heading}>pending transactions</Text>
      </TouchableOpacity>
      {visible && (
        <>
          {recent.length === 0 && (
            <Text style={styles.emptyState}>no transactions yet</Text>
          )}
          {recent.map((tx: any, index) => (
            <ActivityRow
              key={`activity-${index}`}
              activityTransaction={tx}
              navigation={navigation}
            />
          ))}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  heading: {
    paddingVertical: 15,
    fontSize: 16,
    color: '#66777E',
  },
  portfolio: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
    borderRadius: 25,
    borderColor: '#e1e1e1',
    borderTopWidth: 1,
  },
  moreButton: {
    borderWidth: 0,
    textAlign: 'right',
  },
  emptyState: {
    paddingBottom: 20,
  },
})

export default PendingActivityComponent
