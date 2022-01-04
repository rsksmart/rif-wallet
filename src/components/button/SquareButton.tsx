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
  icon?: any
  onPress?: (event: GestureResponderEvent) => any
  disabled?: boolean
  testID?: string
  color?: string
}

export const SquareButton: React.FC<Interface> = ({
  title,
  icon,
  onPress,
  disabled,
  testID,
  color,
}) => {
  const imageStyle = {
    ...styles.image,
    shadowColor: color,
  }
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
      testID={testID}>
      <View style={imageStyle}>{icon}</View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'center',
  },
  text: {
    paddingTop: 10,
    textAlign: 'center',
  },
  textDisabled: {
    color: '#cccccc',
  },
})
