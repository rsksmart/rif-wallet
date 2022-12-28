import { useCallback, useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { KeyManagementSystem, RIFWallet } from 'lib/core'
import { i18nInit } from 'lib/i18n'
import { RifWalletServicesAuth } from 'lib/rifWalletServices/RifWalletServicesAuth'
import { RifWalletServicesFetcher } from 'lib/rifWalletServices/RifWalletServicesFetcher'

import {
  RootNavigationComponent,
  RootTabsParamsList,
} from 'navigation/rootNavigator'
import ModalComponent from '../ux/requestsModal/ModalComponent'

import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native'

import { WalletConnectProviderElement } from 'screens/walletConnect/WalletConnectContext'
import { useRifSockets } from 'src/subscriptions/useRifSockets'
import { LoadingScreen } from 'components/loading/LoadingScreen'
import { Cover } from './components/Cover'
import { RequestPIN } from './components/RequestPIN'
import { useBitcoinCore } from './hooks/bitcoin/useBitcoinCore'
import { useStateSubscription } from './hooks/useStateSubscription'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  closeRequest,
  selectRequests,
  selectSelectedWallet,
  selectSettingsIsLoading,
  selectTopColor,
  selectWallets,
  setChainId,
} from 'store/slices/settingsSlice'
import { getKeys, hasKeys, hasPin } from 'storage/MainStorage'
import { BitcoinProvider } from 'core/hooks/bitcoin/BitcoinContext'
import { InjectSelectedWallet } from 'src/Context'
import * as Screens from 'screens/index'
import { authAxios, publicAxios } from './setup'

export const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  BalancesScreen: InjectSelectedWallet(Screens.BalancesScreen),
  ActivityScreen: InjectSelectedWallet(Screens.ActivityScreen),
  ActivityDetailsScreen: InjectSelectedWallet(Screens.ActivityDetailsScreen),
  ManuallyDeployScreen: InjectSelectedWallet(Screens.ManuallyDeployScreen),
  WalletConnectScreen: InjectSelectedWallet(Screens.WalletConnectScreen),
  ScanQRScreen: InjectSelectedWallet(Screens.ScanQRScreen),
  SearchDomainScreen: InjectSelectedWallet(Screens.SearchDomainScreen),
  RequestDomainScreen: InjectSelectedWallet(Screens.RequestDomainScreen),
  RegisterDomainScreen: InjectSelectedWallet(Screens.RegisterDomainScreen),
  BuyDomainScreen: InjectSelectedWallet(Screens.BuyDomainScreen),
  AliasBoughtScreen: InjectSelectedWallet(Screens.AliasBoughtScreen),
  HomeScreen: InjectSelectedWallet(Screens.HomeScreen),
  AccountsScreen: InjectSelectedWallet(Screens.AccountsScreen),
}

export const navigationContainerRef =
  createNavigationContainerRef<RootTabsParamsList>()

export const Core = () => {
  const [fetcher, setFetcher] = useState<RifWalletServicesFetcher | undefined>(
    undefined,
  )
  const dispatch = useAppDispatch()

  const selectedWallet = useAppSelector(selectSelectedWallet)
  const wallets = useAppSelector(selectWallets)
  const settingsIsLoading = useAppSelector(selectSettingsIsLoading)
  const requests = useAppSelector(selectRequests)
  const [mnemonic, setMnemonic] = useState<string | null>(null)

  const insets = useSafeAreaInsets()
  const topColor = useAppSelector(selectTopColor)

  const BitcoinCore = useBitcoinCore(mnemonic, fetcher)

  const { unlocked, active } = useStateSubscription()

  const retrieveChainId = useCallback(
    async (wallet: RIFWallet) => {
      const chainId = await wallet.getChainId()
      dispatch(setChainId(chainId))
    },
    [dispatch],
  )

  useRifSockets({
    appActive: active,
    wallet: wallets && wallets[selectedWallet],
    mnemonic,
    fetcher,
  })

  useEffect(() => {
    const fn = async () => {
      await i18nInit()
    }
    fn()
  }, [])

  useEffect(() => {
    if (!wallets) {
      return
    }

    const keys = getKeys()
    if (!keys) {
      throw new Error('Could not fetch keys')
    }

    const { kms } = KeyManagementSystem.fromSerialized(keys)

    setMnemonic(kms.mnemonic)
  }, [wallets])

  useEffect(() => {
    if (selectedWallet && wallets) {
      const currentWallet = wallets[selectedWallet]
      retrieveChainId(currentWallet)
      const rifWalletAuth = new RifWalletServicesAuth(
        publicAxios,
        currentWallet,
      )
      rifWalletAuth.login().then(({ accessToken, refreshToken }) => {
        const fetcherInstance = new RifWalletServicesFetcher(
          authAxios,
          accessToken,
          refreshToken,
        )
        setFetcher(fetcherInstance)
      })
    }
  }, [selectedWallet, retrieveChainId, wallets])

  if (settingsIsLoading && !unlocked) {
    return <LoadingScreen />
  }

  // handles the top color behind the clock
  const styles = StyleSheet.create({
    top: { backgroundColor: topColor, paddingTop: insets.top, flex: 1 },
    body: {
      backgroundColor: topColor,
    },
  })

  if (hasKeys() && hasPin() && !unlocked) {
    return <RequestPIN />
  }

  return (
    <View style={styles.top}>
      <StatusBar backgroundColor={topColor} />
      {!active && <Cover />}
      <BitcoinProvider BitcoinCore={BitcoinCore}>
        <NavigationContainer ref={navigationContainerRef}>
          <WalletConnectProviderElement>
            <>
              <RootNavigationComponent />

              {requests.length !== 0 && (
                <ModalComponent
                  closeModal={() => dispatch(closeRequest())}
                  request={requests[0]}
                />
              )}
            </>
          </WalletConnectProviderElement>
        </NavigationContainer>
      </BitcoinProvider>
    </View>
  )
}
