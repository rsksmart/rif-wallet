import { useContext, useState } from 'react'

import { isBitcoinAddressValid } from 'lib/bitcoin/utils'
import { useAppSelector } from 'src/redux/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator'

import { QRCodeScanner } from 'components/QRCodeScanner'
import { WalletConnectContext } from './WalletConnectContext'

export const ScanQRScreen = ({
  navigation,
}: RootStackScreenProps<rootStackRouteNames.ScanQR>) => {
  const { wallet } = useAppSelector(selectActiveWallet)

  const { createSession } = useContext(WalletConnectContext)
  const [isConnecting, setIsConnecting] = useState(false)

  const onCodeRead = (data: string) => {
    // Metamask QR
    if (data.startsWith('ethereum:')) {
      navigation.navigate(rootStackRouteNames.Send, {
        to: data.split('ethereum:')[1],
      })
    } else if (isBitcoinAddressValid(data)) {
      navigation.navigate(rootStackRouteNames.Send, {
        to: data,
      })
    } else if (data.startsWith('wc:')) {
      if (!isConnecting && wallet) {
        setIsConnecting(true)
        createSession(wallet, data)
        // wait for session request
        navigation.reset({
          index: 0,
          routes: [{ name: rootStackRouteNames.WalletConnect }],
        })
      }
    }
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
