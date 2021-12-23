import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface Interface {
  visible: boolean
  setPanelActive: () => void
}

const InjectedBrowserComponent: React.FC<Interface> = ({
  visible,
  setPanelActive,
}) => {
  return (
    <View style={visible ? styles.roundedBox : styles.roundedBoxNotVisible}>
      <TouchableOpacity onPress={setPanelActive} disabled={visible}>
        <Text style={styles.heading}>Explore Dapps</Text>
      </TouchableOpacity>
      {visible && (
        <>
          <Text>Dapp 1</Text>
          <Text>Dapp 2</Text>
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
  roundedBox: {
    paddingHorizontal: 25,
    borderRadius: 25,
    paddingBottom: 20,
  },
  roundedBoxNotVisible: {
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
})

export default InjectedBrowserComponent
