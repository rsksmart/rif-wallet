import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from 'src/styles'
import { StyledButton, StyledButtonProps } from './StyledButton'

export const SecondaryButton: React.FC<StyledButtonProps> = props => (
  <StyledButton {...props} buttonStyles={styles} />
)

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.lightPurple,
    backgroundColor: colors.background.darkBlue,
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
