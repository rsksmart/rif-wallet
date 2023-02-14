import { StyleSheet, View } from 'react-native'

import ProgressStartIcon from 'components/icons/ProgressStartIcon'
import { sharedColors } from 'shared/constants'
import ProgressEndIcon from 'components/icons/ProgressEndIcon'
import { ProfileStatus } from 'navigation/profileNavigator/types'
import { useCallback } from 'react'

interface ProgressBarProps {
  status: ProfileStatus
  width?: number
  height?: number
}

export const ProgressComponent = ({
  status,
  width = 18,
  height = 7,
}: ProgressBarProps) => {
  const getColors = useCallback(() => {
    switch (status) {
      case ProfileStatus.REQUESTING:
        return {
          start: sharedColors.warning,
          end: sharedColors.inputActive,
        }
      case ProfileStatus.READY_TO_PURCHASE:
        return {
          start: sharedColors.success,
          end: sharedColors.inputActive,
        }
      case ProfileStatus.PURCHASING:
        return { start: sharedColors.success, end: sharedColors.warning }
    }
    return {
      start: sharedColors.inputActive,
      end: sharedColors.inputActive,
    }
  }, [status])
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
