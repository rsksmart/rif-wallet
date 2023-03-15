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
  width?: number
  height?: number
  style?: StyleProp<ViewStyle>
}

export const StepperComponent = ({
  colors,
  width = 18,
  height = 7,
  style,
}: ProgressBarProps) => {
  return (
    <View style={[sharedStyles.row, style]}>
      {colors.map((backgroundColor, index) => {
        const commonStyle = castStyle.view({ width, height, backgroundColor })
        const stepStyle = [commonStyle]
        if (index === 0) {
          stepStyle.push({
            borderTopLeftRadius: height / 2,
            borderBottomLeftRadius: height / 2,
          })
        } else if (index === colors.length - 1) {
          stepStyle.push(styles.separator)
          stepStyle.push({
            borderTopRightRadius: height / 2,
            borderBottomRightRadius: height / 2,
          })
        } else {
          stepStyle.push(styles.separator)
        }
        return <View key={index} style={stepStyle} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  separator: castStyle.view({
    marginLeft: 2,
  }),
})
