import { ProfileStatus } from 'navigation/profileNavigator/types'
import { sharedColors } from 'src/shared/constants'
import { selectProfileStatus } from 'store/slices/profileSlice'
import { useAppSelector } from 'store/storeUtils'

export const useStatusColors = () => {
  const status = useAppSelector(selectProfileStatus)
  switch (status) {
    case ProfileStatus.REQUESTING:
      return {
        startColor: sharedColors.warning,
        endColor: sharedColors.inputActive,
      }
    case ProfileStatus.READY_TO_PURCHASE:
      return {
        startColor: sharedColors.successLight,
        endColor: sharedColors.inputActive,
      }
    case ProfileStatus.PURCHASING:
      return {
        startColor: sharedColors.successLight,
        endColor: sharedColors.warning,
      }
    case ProfileStatus.REQUESTING_ERROR:
      return {
        startColor: sharedColors.danger,
        endColor: sharedColors.inputActive,
      }
  }
  return {
    startColor: sharedColors.inputActive,
    endColor: sharedColors.inputActive,
  }
}
