import React, { useRef, useContext, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Dimensions,
  Text,
} from 'react-native'

import { RNCamera } from 'react-native-camera'
import LinearGradient from 'react-native-linear-gradient'
import { Button } from '../../components'
import { useSelectedWallet } from '../../Context'
import { setOpacity } from '../home/tokenColor'
import { WalletConnectContext } from './WalletConnectContext'

interface IScanQRScreenProps {
  route: any
}

const windowWidth = Dimensions.get('window').width
const qrCodeSize = windowWidth * 0.6

const ScanQRScreen: React.FC<IScanQRScreenProps> = () => {
  const { wallet } = useSelectedWallet()

  const { createSession } = useContext(WalletConnectContext)
  const [isConnecting, setIsConnecting] = useState(false)

  const cameraRef = useRef<RNCamera>(null)

  return (
    <LinearGradient
      colors={['#FFFFFF', setOpacity('#CCCCCC', 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <Text style={styles.header}>Scan QR</Text>
        <View style={styles.cameraContainer}>
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
            onBarCodeRead={async event => {
              if (isConnecting) {
                return
              }

              const data = decodeURIComponent(event.data)

              setIsConnecting(true)

              createSession(wallet, data)
            }}
          />
        </View>
        <Text style={styles.header}>Or use the URI</Text>
        <View>
          <InputWithButton onSubmit={input => createSession(wallet, input)} />
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const InputWithButton: React.FC<{ onSubmit?: (text: string) => void }> = ({
  onSubmit,
}) => {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!onSubmit) {
      return
    }
    onSubmit(text)
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 10,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#e6e6e6',
        borderRadius: 10,
        backgroundColor: '#fff',
      }}>
      <View style={{ flex: 4 }}>
        <TextInput
          onChangeText={textEntry => {
            setText(textEntry)
          }}
          style={{ backgroundColor: 'transparent' }}
          onSubmitEditing={handleSubmit}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Button
          title="&#10132;"
          style={{ minWidth: 0 }}
          onPress={handleSubmit}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .1)',
    marginVertical: 40,
    padding: 20,
    borderRadius: 20,
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
