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
          style.push(styles.start)
        } else if (index === colors.length - 1) {
          style.push(styles.end)
        } else {
          style.push(styles.middle)
        }
        return <View key={index} style={style} />
      })}
    </>
  )
}

const styles = StyleSheet.create({
  start: castStyle.view({
    borderTopLeftRadius: 3.5,
    borderBottomLeftRadius: 3.5,
  }),
  end: castStyle.view({
    marginLeft: 1,
    borderTopRightRadius: 3.5,
    borderBottomRightRadius: 3.5,
  }),
  middle: castStyle.view({
    marginLeft: 1,
  }),
})
