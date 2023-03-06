import { useCallback } from 'react'
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'

interface ProgressBarProps {
  colors: ColorValue[]
  stepWidth?: number
  stepHeight?: number
  style?: StyleProp<ViewStyle>
}

export const StepperComponent = ({
  colors,
  stepWidth = 18,
  stepHeight = 7,
  style,
}: ProgressBarProps) => {
  const getStep = useCallback(
    (color: ColorValue): ViewStyle => ({
      width: stepWidth,
      height: stepHeight,
      backgroundColor: color,
    }),
    [stepWidth, stepHeight],
  )

  return (
    <View style={[sharedStyles.row, style]}>
      {colors.map((color, index) =>
        index === 0 ? (
          <View key={index} style={[styles.startStep, getStep(color)]} />
        ) : index === colors.length - 1 ? (
          <View
            key={index}
            style={[styles.endStep, styles.separator, getStep(color)]}
          />
        ) : (
          <View key={index} style={[styles.separator, getStep(color)]} />
        ),
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  startStep: castStyle.view({
    borderTopLeftRadius: 45,
    borderBottomLeftRadius: 45,
  }),
  endStep: castStyle.view({
    borderTopRightRadius: 45,
    borderBottomRightRadius: 45,
  }),
  separator: castStyle.view({
    marginLeft: 2,
  }),
})
