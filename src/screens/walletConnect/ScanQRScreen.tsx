import { isBitcoinAddressValid } from '@rsksmart/rif-wallet-bitcoin'
import { decodeString } from '@rsksmart/rif-wallet-eip681'
import { useContext, useState } from 'react'

import { QRCodeScanner } from 'components/QRCodeScanner'
import { getWalletSetting, SETTINGS } from 'core/config'
import { networkType } from 'core/setup'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import { selectActiveWallet } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'

import { WalletConnectContext } from './WalletConnectContext'

export const ScanQRScreen = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.ScanQR>) => {
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
          routes: [{ name: rootTabsRouteNames.WalletConnect }],
        })
      }
    } else if (decodedString.address !== undefined) {
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Send,
        params: {
          backAction: navigation.goBack,
          to: decodedString.address,
        },
      })
    } else if (isBitcoinAddressValid(data)) {
      // Default bitcoin token will be fetched from ENV
      const defaultToken = getWalletSetting(
        SETTINGS.QR_READER_BITCOIN_DEFAULT_NETWORK,
        networkType,
      )
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Send,
        params: {
          backAction: navigation.goBack,
          to: data,
          contractAddress: defaultToken,
        },
      })
    }
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
