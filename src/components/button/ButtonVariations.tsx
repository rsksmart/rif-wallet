import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { colors } from '../../styles/colors'
import BaseButton, { BaseButtonInterface } from './BaseButton'

export interface ButtonInterface extends BaseButtonInterface {
  title: string
  icon?: any
}

const Button: React.FC<ButtonInterface & { buttonStyles: any }> = ({
  title,
  disabled,
  icon,
  buttonStyles,
  ...props
}) => {
  return (
    <BaseButton
      {...props}
      style={disabled ? buttonStyles.buttonDisabled : buttonStyles.button}
      underlayColor={
        disabled
          ? buttonStyles.buttonDisabled.backgroundColor
          : buttonStyles.buttonActive.backgroundColor
      }>
      <View style={buttonSharedStyles.contentWrapper}>
        <Text
          style={
            disabled
              ? { ...buttonSharedStyles.text, ...buttonStyles.textDisabled }
              : { ...buttonSharedStyles.text, ...buttonStyles.text }
          }>
          {icon && <View style={buttonSharedStyles.iconContainer}>{icon}</View>}
          {title}
        </Text>
      </View>
    </BaseButton>
  )
}

// Blue Variation
export const BlueButton: React.FC<ButtonInterface> = props => (
  <Button {...props} buttonStyles={blueStyles} />
)

const buttonSharedStyles = StyleSheet.create({
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
  },

  iconContainer: {
    marginTop: -10,
  },

  text: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
})

const blueStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.blue,
  },
  buttonDisabled: {
    backgroundColor: '#251e79',
  },
  buttonActive: {
    backgroundColor: '#7f77fa',
  },
  text: {
    color: colors.lightPurple,
  },
  textDisabled: {
    color: '#7e7eb8',
  },
})

// White Variation
export const WhiteButton: React.FC<ButtonInterface> = props => (
  <Button {...props} buttonStyles={whiteStyles} />
)

const whiteStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightPurple,
  },
  buttonDisabled: {
    backgroundColor: colors.lightPurple,
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

// Outline Variation
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

export const OutlineButton: React.FC<ButtonInterface> = props => (
  <Button {...props} buttonStyles={outlineStyles} />
)

export default BlueButton
