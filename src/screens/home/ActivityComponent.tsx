import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { Button } from '../../components'
import ActivityRow from '../activity/ActivityRow'
import recentTransactions from './tempRecent.json'

interface Interface {
  visible: boolean
  setPanelActive: () => void
  navigation: any
}

const ActivityComponent: React.FC<Interface> = ({
  visible,
  setPanelActive,
  navigation,
}) => {
  const recent = recentTransactions.slice(0, 5)

  return (
    <ScrollView style={styles.portfolio}>
      <TouchableOpacity onPress={setPanelActive} disabled={visible}>
        <Text style={styles.heading}>transactions</Text>
      </TouchableOpacity>
      {visible && (
        <>
          {recent.map((tx: any) => (
            <ActivityRow
              key={tx.hash}
              activityTransaction={tx}
              navigation={navigation}
            />
          ))}
          <Button
            title="see all"
            onPress={() => navigation.navigate('Activity')}
            style={styles.moreButton}
          />
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
})

export default ActivityComponent
