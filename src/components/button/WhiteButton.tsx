import { StyleSheet } from 'react-native'

import { colors } from 'src/styles'

import { StyledButton } from './StyledButton'
import { ButtonProps } from './types'

export const WhiteButton = (props: ButtonProps) => (
  <StyledButton
    {...props}
    title={props.title || ''}
    buttonStyles={whiteStyles}
  />
)

const whiteStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightPurple,
  },
  buttonPressed: {},
  buttonDisabled: {
    backgroundColor: colors.black,
  },
  buttonActive: {
    backgroundColor: '#FFCC33',
  },
  text: {
    color: '#51517c',
  },
  textPressed: {},
  textDisabled: {
    color: '#9296b9',
  },
})

export const WhiteTransparentButton: React.FC<ButtonProps> = props => (
  <StyledButton
    {...props}
    title={props.title || ''}
    buttonStyles={whiteTransparentStyles}
  />
)

const whiteTransparentStyles = StyleSheet.create({
  ...whiteStyles,
  button: {
    backgroundColor: colors.transparentWhite,
  },
})
