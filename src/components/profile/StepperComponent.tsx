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
      {colors.map((color, index) => {
        let style = castStyle.view({ width, height, backgroundColor: color })
        if (index === 0) {
          style = { ...style, ...styles.start }
        } else if (index === colors.length - 1) {
          style = { ...style, ...styles.end }
        } else {
          style = { ...style, ...styles.middle }
        }
        return <View key={index} style={style} />
      })}
    </>
  )
}

const styles = StyleSheet.create({
  start: castStyle.view({
    marginRight: 0.5,
    borderTopLeftRadius: 3.5,
    borderBottomLeftRadius: 3.5,
  }),
  end: castStyle.view({
    marginLeft: 0.5,
    borderTopRightRadius: 3.5,
    borderBottomRightRadius: 3.5,
  }),
  middle: castStyle.view({
    marginHorizontal: 0.5,
  }),
})
