import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import BaseButton, { BaseButtonProps } from './BaseButton'

export interface StyledButtonProps extends BaseButtonProps {
  title?: string
  icon?: any
  accessibilityLabel?: string
  buttonStyles?: any
}

export const StyledButton: React.FC<StyledButtonProps> = ({
  title,
  disabled,
  icon,
  style,
  buttonStyles,
  ...props
}) => {
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
