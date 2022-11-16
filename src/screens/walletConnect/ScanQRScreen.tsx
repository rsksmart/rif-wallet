import { useContext, useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import { QRCodeScanner } from '../../components/QRCodeScanner'
import { useSelectedWallet } from '../../Context'
import { WalletConnectContext } from './WalletConnectContext'

export const ScanQRScreen = () => {
  const { wallet } = useSelectedWallet()
  const navigation = useNavigation()

  const { createSession } = useContext(WalletConnectContext)
  const [isConnecting, setIsConnecting] = useState(false)

  const onCodeRead = (data: string) => {
    if (!isConnecting) {
      setIsConnecting(true)
      createSession(wallet, data)
    }

    // wait for session request
    navigation.reset({
      index: 0,
      routes: [{ name: 'WalletConnect' as never }],
    })
  }

  const onClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate('Home' as never)
    }
  }

  return <QRCodeScanner onCodeRead={onCodeRead} onClose={onClose} />
}
