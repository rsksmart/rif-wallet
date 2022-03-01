import React, { ReactNode } from 'react'
import { TouchableHighlight, StyleSheet } from 'react-native'

export interface ButtonInterface {
  onPress?: () => any
  title?: string
  disabled?: boolean
}

interface BaseButton {
  variantStyle?: any
  underlayColor?: string
  children: ReactNode
}

const BaseButton: React.FC<ButtonInterface & BaseButton> = ({
  children,
  variantStyle,
  underlayColor,
  disabled,
  onPress,
}) => {
  return (
    <TouchableHighlight
      style={{ ...styles.container, ...variantStyle }}
      onPress={onPress}
      underlayColor={underlayColor}
      disabled={disabled}>
      {children}
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    maxWidth: 180,
  },
})

export const textSharedStyles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
})

export default BaseButton
