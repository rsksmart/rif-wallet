import { StyleSheet, View, ViewProps } from 'react-native'
import { ComponentProps } from 'react'

import { castStyle } from 'shared/utils'
import { WINDOW_HEIGHT, WINDOW_WIDTH, sharedStyles } from 'shared/constants'
import { AppSpinner, Typography, TypographyType } from 'src/components'

interface FullScreenSpinnerProps {
  containerViewProps?: ViewProps
  spinnerProps?: ComponentProps<typeof AppSpinner>
  message?: {
    text: string
    variant?: TypographyType
  }
}

export const FullScreenSpinner = ({
  containerViewProps,
  spinnerProps,
  message,
}: FullScreenSpinnerProps) => (
  <View style={FullScreenSpinnerStyles} {...containerViewProps}>
    <AppSpinner size={64} thickness={10} {...spinnerProps} />
    {message && (
      <Typography type={message.variant || 'h3'}>{message.text}</Typography>
    )}
  </View>
)

const styles = StyleSheet.create({
  spinnerView: castStyle.view({
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  }),
})

export const FullScreenSpinnerStyles = [
  sharedStyles.contentCenter,
  styles.spinnerView,
]
