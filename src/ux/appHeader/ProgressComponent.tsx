import { StyleSheet, View } from 'react-native'

import ProgressStartIcon from 'components/icons/ProgressStartIcon'
import { sharedColors } from 'shared/constants'
import ProgressEndIcon from 'components/icons/ProgressEndIcon'
import { colors } from 'src/styles'
import { ProgressBarStatus } from 'navigation/profileNavigator/types'

interface ProgressBarProps {
  width: number
  height: number
  status: ProgressBarStatus
}

export const ProgressComponent = ({
  width = 18,
  height = 7,
  status,
}: ProgressBarProps) => {
  const getColors = () => {
    switch (status) {
      case ProgressBarStatus.REQUESTING:
        return { start: sharedColors.warning, end: colors.progress.default }
      case ProgressBarStatus.PURCHASE:
        return { start: sharedColors.success, end: colors.progress.default }
      case ProgressBarStatus.PURCHASING:
        return { start: sharedColors.success, end: sharedColors.warning }
    }
  }
  const { start, end } = getColors()

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
    color: colors.white,
    paddingLeft: 6,
  },
})
