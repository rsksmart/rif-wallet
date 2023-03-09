import { StyleSheet, View } from 'react-native'

import { castStyle } from 'shared/utils'

interface ProgressBarProps {
  colors: string[]
  width?: number
  height?: number
}

export const StepperComponent = ({
  colors,
  width = 18,
  height = 7,
}: ProgressBarProps) => {
  return (
    <>
      {colors.map((backgroundColor, index) => {
        const commonStyle = castStyle.view({ width, height, backgroundColor })
        const style = [commonStyle]
        if (index === 0) {
          style.push(
            castStyle.view({
              borderTopLeftRadius: height / 2,
              borderBottomLeftRadius: height / 2,
            }),
          )
        } else if (index === colors.length - 1) {
          style.push(
            castStyle.view({
              marginLeft: 1,
              borderTopRightRadius: height / 2,
              borderBottomRightRadius: height / 2,
            }),
          )
        } else {
          style.push(styles.middle)
        }
        return <View key={index} style={style} />
      })}
    </>
  )
}

const styles = StyleSheet.create({
  middle: castStyle.view({
    marginLeft: 1,
  }),
})
