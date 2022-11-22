import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from '../../styles'
import { StyledButton, StyledButtonProps } from './StyledButton'

export const PrimaryButton: React.FC<StyledButtonProps> = props => (
  <StyledButton {...props} buttonStyles={styles} />
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
  },
})
