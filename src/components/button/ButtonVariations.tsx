import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { colors } from '../../styles'
import BaseButton, { BaseButtonProps } from './BaseButton'

export interface ButtonProps extends BaseButtonProps {
  title?: string
  icon?: any
  accessibilityLabel?: string
  buttonStyles?: any
}

export const Button: React.FC<ButtonProps> = ({
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
      <View style={sharedStyles.contentWrapper}>
        {icon}
        {title && (
          <Text style={{ ...sharedStyles.text, ...textStyle }}>{title}</Text>
        )}
      </View>
    </BaseButton>
  )
}

const sharedStyles = StyleSheet.create({
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

// White Variation
export const WhiteButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={whiteStyles} />
)

const whiteStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightPurple,
  },
  buttonDisabled: {
    backgroundColor: colors.black,
  },
  buttonActive: {
    backgroundColor: '#FFCC33',
  },
  text: {
    color: '#51517c',
  },
  textDisabled: {
    color: '#9296b9',
  },
})
