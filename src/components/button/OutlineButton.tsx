import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from '../../styles'
import { Button, ButtonProps } from './ButtonVariations'

export const OutlineButton: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={styles} />
)

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.lightPurple,
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    borderWidth: 1,
    borderColor: colors.lightPurple,
    backgroundColor: colors.background.darkBlue,
    opacity: 0.5,
  },
  buttonActive: {
    backgroundColor: colors.button.secondary,
  },
  buttonPressed: {
    borderWidth: 1,
    borderColor: colors.lightPurple,
    backgroundColor: colors.button.secondaryPressed,
    opacity: 0.8,
  },
  text: {
    color: colors.lightPurple,
  },
  textDisabled: {
    color: colors.lightPurple,
    opacity: 0.5,
  },
  textPressed: {
    color: colors.button.secondary,
  },
})
