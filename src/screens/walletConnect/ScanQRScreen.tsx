import React, { useContext, useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { BarCodeReadEvent } from 'react-native-camera'
import QRScanner from '../../components/qrScanner'
import LinearGradient from 'react-native-linear-gradient'
import { CustomInput } from '../../components'
import { useSelectedWallet } from '../../Context'
import { WalletConnectContext } from './WalletConnectContext'

interface IScanQRScreenProps {
  route: any
}

const ScanQRScreen: React.FC<IScanQRScreenProps> = () => {
  const { wallet } = useSelectedWallet()

  const { createSession } = useContext(WalletConnectContext)
  const [isConnecting, setIsConnecting] = useState(false)

  const onBardCodeRead = async (event: BarCodeReadEvent) => {
    if (isConnecting) {
      return
    }
    const data = decodeURIComponent(event.data)
    setIsConnecting(true)
    createSession(wallet, data)
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', 'rgba(204, 204, 204, 0.1)']}
      style={styles.parent}>
      <ScrollView>
        <Text style={styles.header}>Scan QR</Text>
        <View style={styles.cameraContainer}>
          <QRScanner onBarCodeRead={onBardCodeRead} />
        </View>
        <Text style={styles.header}>Or use the URI</Text>
        <View>
          <CustomInput onSubmit={input => createSession(wallet, input)} />
        </View>
      </ScrollView>
    </LinearGradient>
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
