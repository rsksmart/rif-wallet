import { StyleSheet, View } from 'react-native'

import StartStepIcon from 'components/icons/StartStepIcon'
import { sharedColors } from 'shared/constants'
import EndStepIcon from 'components/icons/EndStepIcon'
import { castStyle } from 'shared/utils'

interface ProgressBarProps {
  startColor: string
  endColor: string
  width?: number
  height?: number
}

export const StepperComponent = ({
  startColor,
  endColor,
  width = 18,
  height = 7,
}: ProgressBarProps) => {
  return (
    <>
      <View style={styles.textAlignment}>
        <StartStepIcon color={startColor} width={width} height={height} />
      </View>
      <View style={styles.textAlignment}>
        <EndStepIcon color={endColor} width={width} height={height} />
      </View>
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
