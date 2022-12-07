import { ReactNode } from 'react'
import { ViewStyle, TextStyle, ColorValue } from 'react-native'

/**
 * Same as 'StyledButtonProps' but without the styles prop. This should be used
 * when calling buttons
 */
export interface ButtonProps extends BaseButtonProps {
  title?: string
  icon?: ReactNode
  accessibilityLabel: string
}

/**
 * Used to create button variations to be reused, that is why buttonStyles is required
 */
export interface StyledButtonProps extends BaseButtonProps {
  title: string
  icon?: ReactNode
  buttonStyles: {
    button: ViewStyle
    buttonPressed: ViewStyle
    buttonDisabled: ViewStyle
    buttonActive: ViewStyle
    text: TextStyle
    textPressed: TextStyle
    textDisabled: TextStyle
  }
}

export interface BaseButtonProps {
  disabled?: boolean
  testID?: string
  accessibilityLabel: string // required for QA
  style?: ViewStyle
  underlayColor?: ColorValue
  children?: ReactNode
  onPress?: () => void
  onShowUnderlay?: () => void
  onHideUnderlay?: () => void
}
