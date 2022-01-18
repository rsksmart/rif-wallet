import React from 'react'
import {
  GestureResponderEvent,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import ChevronIcon from '../icons/ChevronIcon'

interface Interface {
  title: string
  onPress?: (event: GestureResponderEvent) => any
  disabled?: boolean
  testID?: string
  style?: any
  textStyle?: any
}

export const ButtonAlt: React.FC<Interface> = ({
  title,
  onPress,
  disabled,
  testID,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={style ? { ...styles.button, ...style } : styles.button}
      onPress={onPress}
      disabled={disabled}
      testID={testID}>
      <Text
        style={
          disabled ? styles.textDisabled : { ...styles.text, ...textStyle }
        }>
        {title}
      </Text>
      <ChevronIcon color="#575757" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    fontSize: 18,
    padding: 14,
    borderRadius: 14,
    //borderColor: '#575757',
    // borderWidth: 4,
    minWidth: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 1,
    backgroundColor: '#ffffff',
  },
  text: {
    color: '#575757',
  },
  textDisabled: {
    color: '#cccccc',
  },
})
