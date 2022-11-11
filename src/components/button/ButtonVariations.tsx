import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { colors } from '../../styles'
import BaseButton, { BaseButtonProps } from './BaseButton'

export interface ButtonProps extends BaseButtonProps {
  title: string
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
        {icon && <View>{icon}</View>}
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

// Blue Variation
export const BlueButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={blueStyles} />
)

const blueStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightBlue,
  },
  buttonDisabled: {
    backgroundColor: '#251e79',
  },
  buttonActive: {
    backgroundColor: colors.button.primary,
  },
  text: {
    color: colors.lightPurple,
  },
  textDisabled: {
    color: '#7e7eb8',
  },
})

export const DarkBlueButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={darkBlueStyles} />
)

const darkBlueStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.darkPurple5,
  },
  buttonDisabled: {
    backgroundColor: '#251e79',
  },
  buttonActive: {
    backgroundColor: colors.gray,
  },
  text: {
    color: colors.lightPurple,
  },
  textDisabled: {
    color: '#7e7eb8',
  },
})

// White Variation
export const WhiteButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={whiteStyles} />
)

export const WhiteTransparentButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={whiteTransparentStyles} />
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

const whiteTransparentStyles = StyleSheet.create({
  ...whiteStyles,
  button: {
    backgroundColor: colors.transparentWhite,
  },
})

// Outline Variation
export const OutlineButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={outlineStyles} />
)

const outlineStyles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: colors.lightPurple,
  },
  buttonDisabled: {
    borderWidth: 2,
    borderColor: colors.gray,
  },
  buttonActive: {
    backgroundColor: '#3a3966',
  },
  text: {
    color: colors.lightPurple,
  },
  textDisabled: {
    color: colors.lightPurple,
  },
})

export const OutlineBorderedButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={outlineBorderedStyles} />
)

const outlineBorderedStyles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: colors.black,
  },
  buttonDisabled: {
    borderWidth: 2,
    borderColor: colors.gray,
  },
  buttonActive: {
    backgroundColor: colors.gray,
  },
  text: {
    color: colors.black,
  },
  textDisabled: {
    color: colors.lightBlue,
  },
})

// gray button:
export const GrayButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={grayStyles} />
)

const grayStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightGray,
  },
  buttonDisabled: {},
  buttonActive: {
    backgroundColor: colors.lightPurple,
  },
  text: {
    color: colors.darkPurple3,
  },
  textDisabled: {},
})
