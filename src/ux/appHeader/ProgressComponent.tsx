import { StyleSheet, View } from 'react-native'

import ProgressStartIcon from 'components/icons/ProgressStartIcon'
import { sharedColors } from 'shared/constants'
import ProgressEndIcon from 'components/icons/ProgressEndIcon'
import { ProfileStatus } from 'navigation/profileNavigator/types'

interface ProgressBarProps {
  width: number
  height: number
  status: ProfileStatus
}

export const ProgressComponent = ({
  width = 18,
  height = 7,
  status,
}: ProgressBarProps) => {
  const getColors = () => {
    switch (status) {
      case ProfileStatus.REQUESTING:
        return {
          start: sharedColors.warning,
          end: sharedColors.inactiveProgress,
        }
      case ProfileStatus.PURCHASE:
        return {
          start: sharedColors.success,
          end: sharedColors.inactiveProgress,
        }
      case ProfileStatus.PURCHASING:
        return { start: sharedColors.success, end: sharedColors.warning }
    }
    return {
      start: sharedColors.inactiveProgress,
      end: sharedColors.inactiveProgress,
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
    color: sharedColors.white,
    paddingLeft: 6,
  },
})
