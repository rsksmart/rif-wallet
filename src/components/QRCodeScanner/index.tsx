import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native'
import BarcodeMask from 'react-native-barcode-mask'
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera'
import {
  BarcodeFormat,
  Barcode,
  scanBarcodes,
} from 'vision-camera-code-scanner'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useIsFocused } from '@react-navigation/native'
import { runOnJS } from 'react-native-reanimated'

import { colors } from 'src/styles'
import { useAppDispatch } from 'store/storeUtils'
import { setFullscreen } from 'store/slices/settingsSlice'
import { sharedColors } from 'src/shared/constants'
import { castStyle } from 'src/shared/utils'

import { AppTouchable } from '../appTouchable'

interface QRCodeScannerProps {
  onClose: () => void
  onCodeRead: (data: string) => void
}

export const QRCodeScanner = ({ onClose, onCodeRead }: QRCodeScannerProps) => {
  const device = useCameraDevices('wide-angle-camera').back
  const [barcodes, setBarcodes] = useState<Barcode[]>([])
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()

  // Do not use the hook that comes with the camera as it'll not work
  const frameProcessor = useFrameProcessor(frame => {
    'worklet'
    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE])
    runOnJS(setBarcodes)(detectedBarcodes)
  }, [])

  const permissionHandler = useCallback(async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus()
    if (cameraPermission === 'not-determined') {
      await Camera.requestCameraPermission()
    } else if (cameraPermission === 'denied') {
      Linking.openSettings()
    }
  }, [])

  useEffect(() => {
    permissionHandler()
  }, [permissionHandler])

  useEffect(() => {
    if (barcodes && barcodes[0] && barcodes[0].rawValue) {
      onCodeRead(barcodes[0].rawValue)
      dispatch(setFullscreen(false))
    }
  }, [barcodes, onCodeRead, dispatch])

  useEffect(() => {
    dispatch(setFullscreen(!!device && isFocused))
    return () => {
      setFullscreen(false)
    }
  }, [dispatch, device, isFocused])

  if (device == null) {
    return <ActivityIndicator size={'large'} />
  }

  return (
    <View style={styles.container}>
      <Camera
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        device={device}
        style={StyleSheet.absoluteFill}
        isActive={true}
        torch="off"
      />
      <BarcodeMask
        showAnimatedLine={false}
        outerMaskOpacity={0.5}
        width={260}
        height={260}
        edgeColor={colors.white}
        edgeBorderWidth={4}
        edgeHeight={25}
        edgeWidth={25}
        edgeRadius={5}
      />
      <AppTouchable width={48} onPress={onClose} style={styles.floatButton}>
        <Icon
          accessibilityLabel="closeButton"
          name={'times'}
          size={24}
          color={sharedColors.white}
        />
      </AppTouchable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flex: 1,
    alignItems: 'center',
  }),
  floatButton: castStyle.view({
    position: 'absolute',
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: sharedColors.primary,
    height: 52,
    width: 52,
    borderRadius: 26,
  }),
})
