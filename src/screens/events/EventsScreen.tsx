import React from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { Event } from './event'
import Button from '../../components/button/BaseButton'
import { isIncomingEvent, isOutgoinEvent } from '../../subscriptions/utils'

export interface EventsScreenProps {
  events: Array<any>
  smartWalletAddress: string
}

export const EventsScreen: React.FC<EventsScreenProps> = ({
  events,
  smartWalletAddress,
}) => {
  const [tab, setTab] = React.useState<'ALL' | 'INC' | 'OUT'>('ALL')

  const incoming = events.filter(event =>
    isIncomingEvent(event, smartWalletAddress),
  )
  const outgoing = events.filter(event =>
    isOutgoinEvent(event, smartWalletAddress),
  )

  const isSelected = (value: string) => tab === value

  return (
    <View>
      <View style={styles.buttonGroup}>
        <Button
          onPress={() => setTab('ALL')}
          style={{
            ...styles.button,
            ...(isSelected('ALL') && styles.selectedButton),
          }}>
          <Text style={styles.buttonContent}>ALL</Text>
        </Button>
        <Button
          onPress={() => setTab('INC')}
          style={{
            ...styles.button,
            ...(isSelected('INC') && styles.selectedButton),
          }}>
          <Text style={styles.buttonContent}>INCOMING</Text>
        </Button>
        <Button
          onPress={() => setTab('OUT')}
          style={{
            ...styles.button,
            ...(isSelected('OUT') && styles.selectedButton),
          }}>
          <Text style={styles.buttonContent}>OUTGOING</Text>
        </Button>
      </View>
      <ScrollView testID="events">
        {isSelected('ALL') && (
          <React.Fragment>
            {events.map(event => (
              <Event
                from={event.args[0]}
                key={event.transactionHash}
                to={event.args[1]}
                tx={event.transactionHash}
                testID={event.transactionHash}
              />
            ))}
          </React.Fragment>
        )}
        {isSelected('INC') && (
          <React.Fragment>
            {incoming.map(event => (
              <Event
                from={event.args[0]}
                key={event.transactionHash}
                to={event.args[1]}
                tx={event.transactionHash}
                testID={event.transactionHash}
              />
            ))}
          </React.Fragment>
        )}
        {isSelected('OUT') && (
          <React.Fragment>
            {outgoing.map(event => (
              <Event
                from={event.args[0]}
                key={event.transactionHash}
                to={event.args[1]}
                tx={event.transactionHash}
                testID={event.transactionHash}
              />
            ))}
          </React.Fragment>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 15,
  },
  buttonContent: {
    color: '#FFFFFF',
  },
  selectedButton: {
    backgroundColor: 'rgba(219, 227, 255, 0.3)',
  },
})
