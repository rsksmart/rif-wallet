import { Camera, useCameraDevice } from 'react-native-vision-camera'
import { Alert, StyleSheet, View } from 'react-native'
import { useRef, useState } from 'react'
import RNQR from 'rn-qr-generator'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'

import { AppSpinner, AppTouchable } from 'src/components'
import { FullScreenSpinner } from 'components/fullScreenSpinner'
import { QRCodeScannerProps } from 'components/QRCodeScanner'
import { castStyle } from 'shared/utils'
import { sharedColors, sharedStyles } from 'shared/constants'
import { useCheckCameraPermissions } from 'components/QRCodeScanner/useCheckCameraPermissions'

export const AndroidQRScanner = ({
  onCodeRead,
  onClose,
}: QRCodeScannerProps) => {
  const device = useCameraDevice('back')
  const camera = useRef<Camera>(null)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const { t } = useTranslation()
  const isFocused = useIsFocused()

  useCheckCameraPermissions({ t, isFocused })

  const onTakePicture = async () => {
    try {
      setIsProcessingImage(true)
      if (camera.current) {
        const { path } = await camera.current.takePhoto()
        const { values } = await RNQR.detect({ uri: path })
        if (values.length > 0) {
          onCodeRead(values[0])
        } else {
          // Bad image - try again
          Alert.alert(t('android_qr_alert_title'), t('android_qr_alert_desc'))
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(t('android_qr_alert_title'), error.toString())
      }
    } finally {
      setIsProcessingImage(false)
    }
  }

  if (!device) {
    return (
      <FullScreenSpinner
        message={{ text: `${t('android_qr_loading_camera')}...` }}
      />
    )
  }
  return (
    <>
      <Camera
        device={device}
        isActive
        style={StyleSheet.absoluteFill}
        photo
        ref={camera}
      />
      <AppTouchable
        width={30}
        onPress={onClose}
        style={[styles.closeAppTouchable, sharedStyles.marginLeft24]}>
        <Icon name="chevron-left" size={30} color={sharedColors.white} />
      </AppTouchable>
      <View style={styles.viewStyle}>
        {isProcessingImage ? (
          <AppSpinner size={60} thickness={4} />
        ) : (
          <AppTouchable width={60} onPress={onTakePicture}>
            <Icon name="dot-circle" size={60} color={sharedColors.white} />
          </AppTouchable>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  viewStyle: castStyle.view({
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
    alignItems: 'center',
  }),
  closeAppTouchable: castStyle.view({ position: 'absolute', top: '5%' }),
})
