import { useContext, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import { isBitcoinAddressValid } from '@rsksmart/rif-wallet-bitcoin'
import { decodeString } from '@rsksmart/rif-wallet-eip681'

import { QRCodeScanner } from 'components/QRCodeScanner'
import { getWalletSetting, SETTINGS } from 'core/config'
import { networkType } from 'core/setup'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import { selectActiveWallet, setFullscreen } from 'store/slices/settingsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { WalletConnectContext } from './WalletConnectContext'

export const ScanQRScreen = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.ScanQR>) => {
  const dispatch = useAppDispatch()
  const { wallet } = useAppSelector(selectActiveWallet)

  const { createSession } = useContext(WalletConnectContext)
  const [isConnecting, setIsConnecting] = useState(false)
  const isFocused = useIsFocused()

  useEffect(() => {
    dispatch(setFullscreen(isFocused))
  }, [dispatch, isFocused])

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
