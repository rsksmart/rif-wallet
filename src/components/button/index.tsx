import React from 'react'
import {
  GestureResponderEvent,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native'

interface Interface {
  title: string
  onPress?: (event: GestureResponderEvent) => void | null
  disabled?: boolean
}

const Button: React.FC<Interface> = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}>
      <View>
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
})

export default Button
