import { StyleSheet } from 'react-native'

import { colors } from 'src/styles'
import { StyledButton, StyledButtonProps } from './StyledButton'

export const WhiteButton = (props: StyledButtonProps) => (
  <StyledButton {...props} buttonStyles={whiteStyles} />
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

export const WhiteTransparentButton: React.FC<StyledButtonProps> = props => (
  <StyledButton {...props} buttonStyles={whiteTransparentStyles} />
)

const whiteTransparentStyles = StyleSheet.create({
  ...whiteStyles,
  button: {
    backgroundColor: colors.transparentWhite,
  },
})
