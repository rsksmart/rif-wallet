import { isBitcoinAddressValid } from '@rsksmart/rif-wallet-bitcoin'
import { decodeString } from '@rsksmart/rif-wallet-eip681'

import { QRCodeScanner } from 'components/QRCodeScanner'
import { getWalletSetting } from 'core/config'
import { SETTINGS } from 'core/types'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import { selectChainId } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'

export const ScanQRScreen = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.ScanQR>) => {
  const chainId = useAppSelector(selectChainId)
  const onCodeRead = (data: string) => {
    // Metamask QR
    const decodedString = decodeString(data)

    if (data.startsWith('wc:')) {
      navigation.reset({
        index: 0,
        routes: [{ name: rootTabsRouteNames.WalletConnect, params: { data } }],
      })
    } else if (decodedString.address !== undefined) {
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Send,
        params: {
          contact: { address: decodedString.address },
          contractAddress: decodedString.network,
        },
      })
    } else if (isBitcoinAddressValid(data)) {
      // Default bitcoin token will be fetched from ENV
      const defaultToken = getWalletSetting(
        SETTINGS.QR_READER_BITCOIN_DEFAULT_NETWORK,
        chainId,
      )
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Send,
        params: {
          contact: { address: data },
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
