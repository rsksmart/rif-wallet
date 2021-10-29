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
  onPress?: (event: GestureResponderEvent) => any
  disabled?: boolean
  testID?: string
}

export const Button: React.FC<Interface> = ({ title, onPress, disabled, testID }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      testID={testID}>
      <View>
        <Text style={disabled ? styles.textDisabled : styles.text}>
          {title}
        </Text>
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
  text: {},
  textDisabled: {
    color: '#cccccc',
  },
})
