import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import BarcodeMask from 'react-native-barcode-mask'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import Icon from 'react-native-vector-icons/Ionicons'
import { colors } from '../../styles'

interface QRCodeScannerProps {
  onClose: () => void
  onCodeRead: (data: string) => Promise<void> | void
}

export const QRCodeScanner = ({ onClose, onCodeRead }: QRCodeScannerProps) => {
  const cameraRef = useRef<RNCamera>(null)

  const onBarCodeRead = (event: BarCodeReadEvent) => {
    // @ts-ignore
    if (event.type === 'QR_CODE') {
      onCodeRead(decodeURIComponent(event.data))
      onClose()
    }
  }

  return (
    <RNCamera
      ref={cameraRef}
      style={styles.container}
      onBarCodeRead={onBarCodeRead}
      captureAudio={false}
      type={RNCamera.Constants.Type.back}
      flashMode={RNCamera.Constants.FlashMode.off}
      androidCameraPermissionOptions={{
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}>
      <BarcodeMask showAnimatedLine={false} outerMaskOpacity={0.5} />
      <View style={styles.floatButton}>
        <Icon.Button
          accessibilityLabel="closeButton"
          name="close-outline"
          onPress={onClose}
          backgroundColor={colors.lightBlue}
          color={colors.lightPurple}
          style={styles.closeButton}
          size={30}
          borderRadius={40}
        />
      </View>
    </RNCamera>
  )
}

const styles = StyleSheet.create({
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
    marginBottom: 50,
  },
  closeButton: {
    paddingRight: 0,
  },
})
