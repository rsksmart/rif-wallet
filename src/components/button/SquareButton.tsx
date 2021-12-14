import React from 'react'
import {
  GestureResponderEvent,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native'

export interface IconButtonInterface extends Interface {
  color?: string
}

interface Interface {
  title: string
  icon: any
  onPress?: (event: GestureResponderEvent) => any
  disabled?: boolean
  testID?: string
}

export const SquareButton: React.FC<Interface> = ({
  title,
  icon,
  onPress,
  disabled,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      testID={testID}>
      <View style={styles.image}>{icon}</View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 85,
    padding: 10,
  },
  image: {
    width: 65,
    height: 65,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    paddingTop: 10,
    textAlign: 'center',
  },
  textDisabled: {
    color: '#cccccc',
  },
})
