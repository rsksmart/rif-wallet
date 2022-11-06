import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from '../../styles'
import { Button, ButtonProps } from './ButtonVariations'

export const PrimaryButton2: React.FC<ButtonProps> = props => (
  <Button {...props} buttonStyles={styles} />
)

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.background.bustyBlue,
  },
  buttonDisabled: {
    backgroundColor: colors.button.primary,
    opacity: 0.5,
  },
  buttonActive: {
    backgroundColor: colors.button.primary,
  },
  buttonPressed: {
    backgroundColor: colors.button.primaryPressed,
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
    color: colors.lightPurple,
  }
})
