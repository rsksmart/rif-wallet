import { useContext, useState } from 'react'

import { QRCodeScanner } from '../../components/QRCodeScanner'
import { WalletConnectContext } from './WalletConnectContext'
import { useAppSelector } from 'src/redux/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import { homeStackRouteNames } from 'src/navigation/homeNavigator/types'

export const ScanQRScreen = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.ScanQR>) => {
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
      routes: [{ name: rootTabsRouteNames.WalletConnect }],
    })
  }

  const onClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Main,
      })
    }
  }

  return <QRCodeScanner onCodeRead={onCodeRead} onClose={onClose} />
}
