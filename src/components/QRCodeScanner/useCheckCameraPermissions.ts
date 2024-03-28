import { useEffect } from 'react'
import { Camera } from 'react-native-vision-camera'
import { Alert, Linking } from 'react-native'

import { navigationContainerRef } from 'core/Core'

const checkCameraPermissions = async (t: (text: string) => string) => {
  const cameraPermission = Camera.getCameraPermissionStatus()
  if (cameraPermission === 'not-determined') {
    const cameraStatus = await Camera.requestCameraPermission()
    cameraStatus === 'denied' && navigationContainerRef.goBack()
  } else if (cameraPermission === 'denied') {
    Alert.alert(t('camera_alert_title'), t('camera_alert_body'), [
      {
        text: t('camera_alert_button_open_settings'),
        onPress: () => Linking.openSettings(),
      },
      {
        text: t('camera_alert_button_cancel'),
        onPress: () => navigationContainerRef.goBack(),
      },
    ])
  }
}
interface UseCheckCameraPermissionsProps {
  t: (text: string) => string
  isFocused: boolean
}

export const useCheckCameraPermissions = ({
  t,
  isFocused,
}: UseCheckCameraPermissionsProps) => {
  useEffect(() => {
    if (isFocused) {
      checkCameraPermissions(t)
    }
  }, [t, isFocused])
}
