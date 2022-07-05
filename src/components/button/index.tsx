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
  style?: any
  textStyle?: any
}

export const Button: React.FC<Interface> = ({
  title,
  onPress,
  disabled,
  testID,
  style,
  textStyle,
}) => (
  <TouchableOpacity
    style={style ? { ...styles.button, ...style } : styles.button}
    onPress={onPress}
    disabled={disabled}
    testID={testID}>
    <View>
      <Text
        style={
          disabled ? styles.textDisabled : { ...styles.text, ...textStyle }
        }>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    fontSize: 18,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#575757',
    borderWidth: 4,
    minWidth: 100,
  },
  text: {
    color: '#575757',
  },
  textDisabled: {
    color: '#cccccc',
  },
})
