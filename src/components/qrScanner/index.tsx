import React from 'react'
import { Dimensions, StyleSheet } from 'react-native'

import { BarCodeReadEvent, RNCamera } from 'react-native-camera'

type Props = {
  onBarCodeRead: (event: BarCodeReadEvent) => void;
}

const QRScanner = ({ onBarCodeRead }: Props) => {
  const cameraRef = React.useRef<RNCamera>(null)

  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.6

  return (
    <RNCamera
      ref={cameraRef}
      style={{
        ...styles.preview,
        width: qrCodeSize,
        height: qrCodeSize,
      }}
      ratio="1:1"
      type={RNCamera.Constants.Type.back}
      flashMode={RNCamera.Constants.FlashMode.off}
      androidCameraPermissionOptions={{
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}
      captureAudio={false}
      onBarCodeRead={onBarCodeRead}
    />
  )

}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})

export default QRScanner