import { useNavigationState } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button } from '../../components'

interface Interface {
  visible: boolean
  setPanelActive: () => void
  navigation: any
}

const TranscationsComponent: React.FC<Interface> = ({
  visible,
  setPanelActive,
  navigation,
}) => {
  return (
    <View style={styles.portfolio}>
      <TouchableOpacity onPress={setPanelActive} disabled={visible}>
        <Text style={styles.heading}>transactions</Text>
      </TouchableOpacity>
      {visible && (
        <>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text>

          <Button title='more' onPress={() => navigation.navigate('Activity')}/>
        </>
      )}
    </View>
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
  },
})

export default TranscationsComponent
