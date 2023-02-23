import { StyleSheet, View } from 'react-native'

import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { EndStepIcon, MiddleStepIcon, StartStepIcon } from 'components/icons'

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
      {colors.map((color, index) =>
        index === 0 ? (
          <View key={index} style={styles.textAlignment}>
            <StartStepIcon color={color} width={width} height={height} />
          </View>
        ) : index === colors.length - 1 ? (
          <View key={index} style={styles.textAlignment}>
            <EndStepIcon color={color} width={width} height={height} />
          </View>
        ) : (
          <View key={index} style={styles.textAlignment}>
            <MiddleStepIcon color={color} width={width} height={height} />
          </View>
        ),
      )}
    </>
  )
}

const styles = StyleSheet.create({
  textAlignment: castStyle.text({
    justifyContent: 'center',
  }),
  textStatus: castStyle.text({
    fontSize: 14,
    color: sharedColors.white,
    paddingLeft: 6,
  }),
})
