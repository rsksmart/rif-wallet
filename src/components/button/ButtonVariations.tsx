import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { colors } from '../../styles'
import BaseButton, { BaseButtonInterface } from './BaseButton'

export interface ButtonInterface extends BaseButtonInterface {
  title?: string
  icon?: any
  accessibilityLabel?: string
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
      }
      disabled={disabled}>
      <View style={sharedStyles.contentWrapper}>
        {icon && <View style={sharedStyles.iconContainer}>{icon}</View>}
        {title && (
          <Text
            style={
              disabled
                ? { ...sharedStyles.text, ...buttonStyles.textDisabled }
                : { ...sharedStyles.text, ...buttonStyles.text }
            }>
            {title}
          </Text>
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
  iconContainer: {},
  text: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
})

// Blue Variation
export const BlueButton: React.FC<ButtonInterface> = props => (
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
    backgroundColor: '#7f77fa',
  },
  text: {
    color: colors.lightPurple,
  },
  textDisabled: {
    color: '#7e7eb8',
  },
})

export const DarkBlueButton: React.FC<ButtonInterface> = props => (
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
export const WhiteButton: React.FC<ButtonInterface> = props => (
  <Button {...props} buttonStyles={whiteStyles} />
)

export const WhiteTransparentButton: React.FC<ButtonInterface> = props => (
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
export const OutlineButton: React.FC<ButtonInterface> = props => (
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

export const OutlineBorderedButton: React.FC<ButtonInterface> = props => (
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
export const GrayButton: React.FC<ButtonInterface> = props => (
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
