import { StyleSheet, View } from 'react-native'

import ProgressStartIcon from 'components/icons/ProgressStartIcon'
import { sharedColors } from 'shared/constants'
import ProgressEndIcon from 'components/icons/ProgressEndIcon'

interface ProgressBarProps {
  start: string
  end: string
  width?: number
  height?: number
}

export const StepperComponent = ({
  start,
  end,
  width = 18,
  height = 7,
}: ProgressBarProps) => {
  return (
    <>
      <View style={styles.textAlignment}>
        <ProgressStartIcon color={start} width={width} height={height} />
      </View>
      <View style={styles.textAlignment}>
        <ProgressEndIcon color={end} width={width} height={height} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  textAlignment: {
    justifyContent: 'center',
  },
  textStatus: {
    fontSize: 14,
    color: sharedColors.white,
    paddingLeft: 6,
  },
})
