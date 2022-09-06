import React, { useRef } from 'react'
import { StyleSheet } from 'react-native'
import BarcodeMask from 'react-native-barcode-mask'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'

export default () => {
  const cameraRef = useRef<RNCamera>(null)

  const onBarCodeRead = (event: BarCodeReadEvent) => {
    console.log(event)
  }

  return (
    <RNCamera
      ref={cameraRef}
      style={styles.container}
      onBarCodeRead={onBarCodeRead}>
      <BarcodeMask showAnimatedLine={false} outerMaskOpacity={0.8} />
    </RNCamera>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
})
