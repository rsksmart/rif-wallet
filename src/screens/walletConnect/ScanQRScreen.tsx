import { useContext, useState } from 'react'

import { QRCodeScanner } from '../../components/QRCodeScanner'
import { WalletConnectContext } from './WalletConnectContext'
import { useAppSelector } from 'src/redux/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator'

export const ScanQRScreen = ({
  navigation,
}: RootStackScreenProps<rootStackRouteNames.ScanQR>) => {
  const { wallet } = useAppSelector(selectActiveWallet)

  const { createSession } = useContext(WalletConnectContext)
  const [isConnecting, setIsConnecting] = useState(false)

  const onCodeRead = (data: string) => {
    if (!isConnecting && wallet) {
      setIsConnecting(true)
      createSession(wallet, data)
    }

    // wait for session request
    navigation.reset({
      index: 0,
      routes: [{ name: rootStackRouteNames.WalletConnect }],
    })
  }

  const onClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate(rootStackRouteNames.Home)
    }
  }

  return <QRCodeScanner onCodeRead={onCodeRead} onClose={onClose} />
}
