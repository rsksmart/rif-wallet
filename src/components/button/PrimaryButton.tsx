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
    color: colors.lightPurple,
    fontSize: 15,
  },
  textDisabled: {
    color: colors.lightPurple,
    opacity: 0.5,
  },
  textPressed: {
    color: colors.lightPurple,
  },
})
