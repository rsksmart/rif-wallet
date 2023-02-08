import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>
}

export const AppTouchable = ({ children, style, ...props }: Props) => {
  return (
    <Pressable
      style={({ pressed }) => (pressed ? [style, styles.opacity] : style)}
      android_ripple={{
        foreground: true,
        borderless: false,
        color: sharedColors.inputActiveColor,
      }}
      {...props}>
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  opacity: castStyle.view({
    opacity: 0.8,
  }),
})
