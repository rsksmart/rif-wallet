import { ProfileStatus } from 'navigation/profileNavigator/types'
import { sharedColors } from 'src/shared/constants'
import { selectProfileStatus } from 'store/slices/profileSlice'
import { useAppSelector } from 'store/storeUtils'

export const useProfileStatusColors = () => {
  const status = useAppSelector(selectProfileStatus)
  switch (status) {
    case ProfileStatus.REQUESTING:
      return {
        startColor: sharedColors.warning,
        endColor: sharedColors.background.accent,
      }
    case ProfileStatus.READY_TO_PURCHASE:
      return {
        startColor: sharedColors.successLight,
        endColor: sharedColors.background.accent,
      }
    case ProfileStatus.PURCHASING:
      return {
        startColor: sharedColors.successLight,
        endColor: sharedColors.warning,
      }
    case ProfileStatus.REQUESTING_ERROR:
      return {
        startColor: sharedColors.danger,
        endColor: sharedColors.background.accent,
      }
  }
  return {
    startColor: sharedColors.background.accent,
    endColor: sharedColors.background.accent,
  }
}
