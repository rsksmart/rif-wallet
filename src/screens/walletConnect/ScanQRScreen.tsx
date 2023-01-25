import { useContext, useState } from 'react'
import { isBitcoinAddressValid } from '@rsksmart/rif-wallet-bitcoin'

import { decodeString } from 'lib/eip681/decodeString'

import { useAppSelector } from 'src/redux/storeUtils'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator'
import { QRCodeScanner } from 'components/QRCodeScanner'
import { getWalletSetting, SETTINGS } from 'core/config'
import { networkType } from 'core/setup'

import { WalletConnectContext } from './WalletConnectContext'

export const ScanQRScreen = ({
  navigation,
}: RootStackScreenProps<rootStackRouteNames.ScanQR>) => {
  const { wallet } = useAppSelector(selectActiveWallet)

  const { createSession } = useContext(WalletConnectContext)
  const [isConnecting, setIsConnecting] = useState(false)

  const onCodeRead = (data: string) => {
    // Metamask QR
    const decodedString = decodeString(data)

    if (data.startsWith('wc:')) {
      if (!isConnecting && wallet) {
        setIsConnecting(true)
        createSession(wallet, data)
        // wait for session request
        navigation.reset({
          index: 0,
          routes: [{ name: rootStackRouteNames.WalletConnect }],
        })
      }
    } else if (decodedString.address !== undefined) {
      navigation.replace(rootStackRouteNames.Send, {
        to: decodedString.address,
      })
    } else if (isBitcoinAddressValid(data)) {
      // Default bitcoin token will be fetched from ENV
      const defaultToken = getWalletSetting(
        SETTINGS.QR_READER_BITCOIN_DEFAULT_NETWORK,
        networkType,
      )
      navigation.replace(rootStackRouteNames.Send, {
        to: data,
        contractAddress: defaultToken,
      })
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
