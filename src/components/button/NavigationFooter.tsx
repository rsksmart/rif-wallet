import { colors } from '../../styles/colors'

import React from 'react'
import {
  GestureResponderEvent,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { Arrow } from '../icons'

interface Interface {
  title?: string
  icon?: any
  onPress?: (event: GestureResponderEvent) => any
  onBackwards: (event: GestureResponderEvent) => any
  disabled?: boolean
  testID?: string
  shadowColor?: string
  backgroundColor?: string
}

export const NavigationFooter: React.FC<Interface> = ({
  title,
  onPress,
  onBackwards,
  disabled,
  shadowColor,
  backgroundColor = '#fff',
  children,
}) => {
  const imageStyle = {
    ...styles.image,
    shadowColor,
    backgroundColor,
  }

  return (
    <>
      <View>{children}</View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonLeft}
          onPress={onBackwards}
          disabled={disabled}>
          <View style={imageStyle}>
            <Arrow color={colors.blue} rotate={270} width={30} height={30} />
          </View>
          <Text style={styles.text}>back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={onPress}
          disabled={disabled}>
          <Text style={styles.text}>{title}</Text>
          <View style={imageStyle}>
            <Arrow color={colors.blue} rotate={90} width={30} height={30} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    color: colors.white,
    height: 80,
    flexDirection: 'row',
    backgroundColor: colors.blue,
    justifyContent: 'space-between',
  },
  buttonLeft: {
    padding: 10,
    flexDirection: 'row',
  },
  buttonRight: {
    padding: 10,
    flexDirection: 'row',
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 2,
  },
  text: {
    paddingTop: 8,
    color: colors.white,
  },
  textDisabled: {
    color: '#cccccc',
  },
})
