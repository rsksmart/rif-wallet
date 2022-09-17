import React, { useContext, useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import { QRCodeScanner } from '../../components/QRCodeScanner'
import { useSelectedWallet } from '../../Context'
import { WalletConnectContext } from './WalletConnectContext'

const ScanQRScreen = () => {
  const { wallet } = useSelectedWallet()
  const navigation = useNavigation()

  const { createSession } = useContext(WalletConnectContext)
  const [isConnecting, setIsConnecting] = useState(false)

  const onBarCodeRead = async (data: string) => {
    if (!isConnecting) {
      console.log('onBarCodeRead', data)
      setIsConnecting(true)
      createSession(wallet, data)
    }
  }

  const onClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate('Home' as never)
    }
  }

  return <QRCodeScanner onCodeRead={onBarCodeRead} onClose={onClose} />
}

export default ScanQRScreen
