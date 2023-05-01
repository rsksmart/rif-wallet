import { useCallback, useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RifWalletServicesFetcher } from '@rsksmart/rif-wallet-services'
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native'
import * as Keychain from 'react-native-keychain'

import { i18nInit } from 'lib/i18n'

import {
  RootNavigationComponent,
  RootTabsParamsList,
} from 'navigation/rootNavigator'
import { RequestHandler } from 'src/ux/requestsModal/RequestHandler'
import { WalletConnectProviderElement } from 'screens/walletConnect/WalletConnectContext'
import { SocketsEvents, socketsEvents } from 'src/subscriptions/rifSockets'
import { LoadingScreen } from 'components/loading/LoadingScreen'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  closeRequest,
  selectRequests,
  selectSelectedWallet,
  selectTopColor,
  selectWholeSettingsState,
  unlockApp,
} from 'store/slices/settingsSlice'
import { BitcoinProvider } from 'core/hooks/bitcoin/BitcoinContext'
import { InjectSelectedWallet } from 'src/Context'
import * as Screens from 'screens/index'
import { sharedStyles } from 'src/shared/constants'

import { useStateSubscription } from './hooks/useStateSubscription'
import { useBitcoinCore } from './hooks/bitcoin/useBitcoinCore'
import { Cover } from './components/Cover'

export const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  BalancesScreen: InjectSelectedWallet(Screens.BalancesScreen),
  ActivityScreen: InjectSelectedWallet(Screens.ActivityScreen),
  ActivityDetailsScreen: InjectSelectedWallet(Screens.ActivityDetailsScreen),
  RelayDeployScreen: InjectSelectedWallet(Screens.RelayDeployScreen),
  WalletConnectScreen: InjectSelectedWallet(Screens.WalletConnectScreen),
  ScanQRScreen: InjectSelectedWallet(Screens.ScanQRScreen),
  SearchDomainScreen: InjectSelectedWallet(Screens.SearchDomainScreen),
  AliasBoughtScreen: InjectSelectedWallet(Screens.AliasBoughtScreen),
  HomeScreen: InjectSelectedWallet(Screens.HomeScreen),
  AccountsScreen: InjectSelectedWallet(Screens.AccountsScreen),
  PurchaseDomainScreen: InjectSelectedWallet(Screens.PurchaseDomainScreen),
}

export const navigationContainerRef =
  createNavigationContainerRef<RootTabsParamsList>()

export const Core = () => {
  const [fetcher, setFetcher] = useState<
    | RifWalletServicesFetcher<
        Keychain.Options,
        ReturnType<typeof Keychain.setInternetCredentials>
      >
    | undefined
  >(undefined)
  const dispatch = useAppDispatch()

  const selectedWallet = useAppSelector(selectSelectedWallet)
  const settings = useAppSelector(selectWholeSettingsState)
  const requests = useAppSelector(selectRequests)
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const topColor = useAppSelector(selectTopColor)

  // TODO: figure out how to work with fetcher and bitcoin
  const BitcoinCore = useBitcoinCore(selectedWallet ? mnemonic : '', fetcher)
  const { unlocked, active } = useStateSubscription()

  useEffect(() => {
    const fn = async () => {
      await i18nInit()
    }
    fn()
  }, [])

  const unlockAppSetMnemonic = useCallback(async () => {
    try {
      const kms = await dispatch(unlockApp()).unwrap()

      setMnemonic(kms.mnemonic)
    } catch (err) {
      if (typeof err === 'string') {
        // If no wallets - reset mnemonic...
        if (err.includes('No Existing wallets')) {
          setMnemonic(null)
        }
      }
      console.log('ERRR', err)
    }
  }, [dispatch])

  useEffect(() => {
    unlockAppSetMnemonic()
  }, [unlockAppSetMnemonic])

  useEffect(() => {
    if (!active) {
      setFetcher(undefined)
      socketsEvents.emit(SocketsEvents.DISCONNECT)
    }
    return () => {
      socketsEvents.emit(SocketsEvents.DISCONNECT)
    }
  }, [active])

  return (
    <SafeAreaProvider>
      <View style={sharedStyles.flex}>
        <StatusBar backgroundColor={topColor} />
        {!active && <Cover />}
        <BitcoinProvider BitcoinCore={BitcoinCore} onSetMnemonic={setMnemonic}>
          <NavigationContainer ref={navigationContainerRef}>
            <WalletConnectProviderElement>
              {settings.loading && !unlocked ? (
                <LoadingScreen />
              ) : (
                <>
                  <RootNavigationComponent />
                  {requests.length !== 0 && (
                    <RequestHandler
                      request={requests[0]}
                      closeRequest={() => dispatch(closeRequest())}
                    />
                  )}
                </>
              )}
            </WalletConnectProviderElement>
          </NavigationContainer>
        </BitcoinProvider>
      </View>
    </SafeAreaProvider>
  )
}
