import React, { useRef, useContext, useState } from 'react'
import { StyleSheet, View, ScrollView, TextInput } from 'react-native'

import { RNCamera } from 'react-native-camera'
import { Button, Paragraph } from '../../components'
import { WalletConnectContext } from './WalletConnectContext'

interface IScanQRScreenProps {
  route: any
}

const ScanQRScreen: React.FC<IScanQRScreenProps> = () => {
  const { createSession } = useContext(WalletConnectContext)
  const [isConnecting, setIsConnecting] = useState(false)

  const [input, setInput] = useState('')

  const cameraRef = useRef<RNCamera>(null)

  return (
    <ScrollView>
      <Paragraph>Scan QR</Paragraph>
      <View style={styles.container}>
        <RNCamera
          ref={cameraRef}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          captureAudio={false}
          onBarCodeRead={async event => {
            if (isConnecting) {
              return
            }

            const data = decodeURIComponent(event.data)

            console.log('onBarCodeRead', data)

            setIsConnecting(true)

            createSession(data)
          }}
        />
      </View>

      <Paragraph>Or use the URI</Paragraph>
      <View>
        <TextInput
          style={{
            fontSize: 18,
            borderBottomWidth: 1,
            borderColor: '#919191',
            paddingLeft: 10,
            paddingRight: 10,
            margin: 10,
          }}
          value={input}
          onChangeText={setInput}
        />
        <Button title="Confirm URI" onPress={() => createSession(input)} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    height: 400,
  },
  section: {
    marginTop: 160,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
  section2: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
})

export default ScanQRScreen
