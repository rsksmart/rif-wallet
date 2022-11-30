import React, { ReactNode, useState } from 'react'
import { ViewStyle } from 'react-native'
import { StyleSheet, Text, TextStyle, View } from 'react-native'
import BaseButton, { BaseButtonProps } from './BaseButton'

interface ButtonStyles {
  button: ViewStyle
  buttonPressed: ViewStyle
  buttonDisabled: ViewStyle
  buttonActive: ViewStyle
  text: TextStyle
  textPressed: TextStyle
  textDisabled: TextStyle
}

export interface StyledButtonProps extends BaseButtonProps {
  title?: string
  icon?: ReactNode
  accessibilityLabel?: string
  buttonStyles: ButtonStyles
}

export const StyledButton = ({
  title,
  disabled,
  icon,
  style,
  buttonStyles,
  ...props
}: StyledButtonProps) => {
  const [isPressed, setIsPressed] = useState(false)

  let baseButtonStyle = buttonStyles.button
  if (isPressed) {
    baseButtonStyle = buttonStyles.buttonPressed
  } else if (disabled) {
    baseButtonStyle = buttonStyles.buttonDisabled
  }

  let underlayColor = buttonStyles.buttonPressed?.backgroundColor
  if (isPressed) {
    if (disabled) {
      underlayColor = buttonStyles.buttonDisabled.backgroundColor
    } else {
      underlayColor = buttonStyles.buttonActive.backgroundColor
    }
  }

  let textStyle = buttonStyles.text
  if (isPressed) {
    textStyle = buttonStyles.textPressed
  } else if (disabled) {
    textStyle = buttonStyles.textDisabled
  }

  return (
    <BaseButton
      {...props}
      style={{ ...style, ...baseButtonStyle }}
      underlayColor={underlayColor}
      disabled={disabled}
      onShowUnderlay={() => setIsPressed(true)}
      onHideUnderlay={() => setIsPressed(false)}>
      <View style={styles.contentWrapper}>
        {icon}
        {title && <Text style={{ ...styles.text, ...textStyle }}>{title}</Text>}
      </View>
    </BaseButton>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // vertical align
    alignSelf: 'center', // horizontal align
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
})
