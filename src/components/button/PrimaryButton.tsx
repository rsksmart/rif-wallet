import { StyleSheet } from 'react-native'
import { colors } from 'src/styles'
import { StyledButton } from './StyledButton'
import { ButtonProps } from './types'

export const PrimaryButton = (props: ButtonProps) => (
  <StyledButton {...props} title={props.title || ''} buttonStyles={styles} />
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
    fontSize: 14,
    color: colors.lightPurple,
  },
  textDisabled: {
    fontSize: 14,
    color: colors.lightPurple,
    opacity: 0.5,
  },
  textPressed: {
    fontSize: 14,
    color: colors.lightPurple,
  },
})
