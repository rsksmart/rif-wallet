import { ReactElement, useMemo } from 'react'
import {
  FlexStyle,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

interface Props extends PressableProps {
  // a necessary value for android ripple effect
  // to work correctly
  width: FlexStyle['width']
  children: ReactElement
  style?: StyleProp<ViewStyle>
}

export const AppTouchable = ({ children, style, width, ...props }: Props) => {
  const mainStyle = useMemo(
    () =>
      ({
        width,
        justifyContent: 'center',
        alignItems: 'center',
      } as ViewStyle),
    [width],
  )

  return (
    <Pressable
      style={({ pressed }) =>
        pressed
          ? [mainStyle, style, Platform.OS === 'ios' ? styles.opacity : null]
          : [mainStyle, style]
      }
      android_ripple={{
        borderless: false,
        foreground: true,
        color: sharedColors.background.accent,
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
