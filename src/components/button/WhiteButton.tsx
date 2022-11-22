import React from 'react'
import { StyleSheet } from 'react-native'

import { colors } from '../../styles'
import { Button, ButtonProps } from './Button'

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

export const WhiteTransparentButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={whiteTransparentStyles} />
)

const whiteTransparentStyles = StyleSheet.create({
  ...whiteStyles,
  button: {
    backgroundColor: colors.transparentWhite,
  },
})
