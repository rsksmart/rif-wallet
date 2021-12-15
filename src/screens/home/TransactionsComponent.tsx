import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface Interface {
  visible: boolean
  setPanelActive: () => void
}

const TranscationsComponent: React.FC<Interface> = ({
  visible,
  setPanelActive,
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
