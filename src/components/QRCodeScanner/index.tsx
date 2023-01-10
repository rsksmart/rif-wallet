import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Linking,
  Modal,
  StyleSheet,
  View,
} from 'react-native'
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
import Icon from 'react-native-vector-icons/Ionicons'
import { colors } from 'src/styles'
import { runOnJS } from 'react-native-reanimated'
interface QRCodeScannerProps {
  onClose: () => void
  onCodeRead: (data: string) => void
}

export const QRCodeScanner = ({ onClose, onCodeRead }: QRCodeScannerProps) => {
  const device = useCameraDevices('wide-angle-camera').back
  const [barcodes, setBarcodes] = useState<Barcode[]>([])
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
  }, [])

  useEffect(() => {
    if (barcodes && barcodes[0] && barcodes[0].rawValue) {
      onCodeRead(barcodes[0].rawValue)
    }
  }, [barcodes])

  if (device == null) {
    return <ActivityIndicator size={'large'} />
  }

  return (
    <Modal presentationStyle="overFullScreen" style={styles.modal}>
      <Camera
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        device={device}
        isActive={true}
        style={styles.container}>
        <BarcodeMask
          showAnimatedLine={false}
          outerMaskOpacity={0.5}
          width={280}
          height={280}
        />
        <View style={styles.floatButton}>
          <Icon.Button
            accessibilityLabel="closeButton"
            name="close-outline"
            onPress={onClose}
            backgroundColor={colors.lightBlue}
            color={colors.lightPurple}
            style={styles.closeButton}
            size={35}
            borderRadius={40}
          />
        </View>
      </Camera>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  floatButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  closeButton: {
    paddingRight: 0,
  },
})
