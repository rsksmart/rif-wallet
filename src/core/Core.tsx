import { useCallback, useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { i18nInit } from 'lib/i18n'
import { defaultChainId } from 'core/config'

import {
  RifWalletServicesAuth,
  RifWalletServicesFetcher,
} from '@rsksmart/rif-wallet-services'

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
import {
  rifSockets,
  SocketsEvents,
  socketsEvents,
} from 'src/subscriptions/rifSockets'
import { LoadingScreen } from 'components/loading/LoadingScreen'
import { Cover } from './components/Cover'
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
  unlockApp,
} from 'store/slices/settingsSlice'
import { BitcoinProvider } from 'core/hooks/bitcoin/BitcoinContext'
import { InjectSelectedWallet } from 'src/Context'
import * as Screens from 'screens/index'
import { authAxios, defaultTokens, publicAxios } from './setup'
import { useSetGlobalError } from 'src/components/GlobalErrorHandler'
import { authClient } from 'src/core/setup'
import * as Keychain from 'react-native-keychain'
import {
  deleteSignUp,
  getSignUP,
  hasSignUP,
  saveSignUp,
} from 'storage/MainStorage'
import { addOrUpdateBalances } from 'src/redux/slices/balancesSlice'

export const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  BalancesScreen: InjectSelectedWallet(Screens.BalancesScreen),
  ActivityScreen: InjectSelectedWallet(Screens.ActivityScreen),
  ActivityDetailsScreen: InjectSelectedWallet(Screens.ActivityDetailsScreen),
  RelayDeployScreen: InjectSelectedWallet(Screens.RelayDeployScreen),
  WalletConnectScreen: InjectSelectedWallet(Screens.WalletConnectScreen),
  ScanQRScreen: InjectSelectedWallet(Screens.ScanQRScreen),
  SearchDomainScreen: InjectSelectedWallet(Screens.SearchDomainScreen),
  RequestDomainScreen: InjectSelectedWallet(Screens.RequestDomainScreen),
  BuyDomainScreen: InjectSelectedWallet(Screens.BuyDomainScreen),
  AliasBoughtScreen: InjectSelectedWallet(Screens.AliasBoughtScreen),
  HomeScreen: InjectSelectedWallet(Screens.HomeScreen),
  AccountsScreen: InjectSelectedWallet(Screens.AccountsScreen),
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
  const wallets = useAppSelector(selectWallets)
  const settingsIsLoading = useAppSelector(selectSettingsIsLoading)
  const requests = useAppSelector(selectRequests)
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const setGlobalError = useSetGlobalError()

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

  useEffect(() => {
    const fn = async () => {
      await i18nInit()
    }
    fn()
  }, [])

  const unlockAppSetMnemonic = useCallback(async () => {
    try {
      console.log('Mnemonic')
      const kms = await dispatch(unlockApp()).unwrap()

      setMnemonic(kms.mnemonic)
    } catch (err) {
      console.log('ERRR', err)
    }
  }, [dispatch])

  useEffect(() => {
    unlockAppSetMnemonic()
  }, [unlockAppSetMnemonic])

  useEffect(() => {
    if (selectedWallet && wallets) {
      const currentWallet = wallets[selectedWallet]
      retrieveChainId(currentWallet)

      const rifWalletAuth = new RifWalletServicesAuth<
        Keychain.Options,
        ReturnType<typeof Keychain.setInternetCredentials>,
        ReturnType<typeof Keychain.resetInternetCredentials>
      >(publicAxios, currentWallet, {
        authClient,
        onGetSignUp: getSignUP,
        onHasSignUp: hasSignUP,
        onDeleteSignUp: deleteSignUp,
        onSaveSignUp: saveSignUp,
        onSetInternetCredentials: Keychain.setInternetCredentials,
        onResetInternetCredentials: Keychain.resetInternetCredentials,
      })
      rifWalletAuth.login().then(({ accessToken, refreshToken }) => {
        const fetcherInstance = new RifWalletServicesFetcher<
          Keychain.Options,
          ReturnType<typeof Keychain.setInternetCredentials>
        >(authAxios, accessToken, refreshToken, {
          defaultChainId,
          onSetInternetCredentials: Keychain.setInternetCredentials,
          resultsLimit: 10,
        })
        setFetcher(fetcherInstance)
      })
    }
  }, [selectedWallet, retrieveChainId, wallets])

  useEffect(() => {
    if (selectedWallet && wallets && mnemonic && fetcher) {
      dispatch(addOrUpdateBalances(defaultTokens))
      rifSockets({
        wallet: wallets[selectedWallet],
        mnemonic,
        fetcher,
        setGlobalError,
        dispatch,
      })
      socketsEvents.emit(SocketsEvents.CONNECT)
    }
  }, [wallets, selectedWallet, mnemonic, fetcher, dispatch, setGlobalError])

  useEffect(() => {
    if (!active) {
      socketsEvents.emit(SocketsEvents.DISCONNECT)
    }
    return () => {
      socketsEvents.emit(SocketsEvents.DISCONNECT)
    }
  }, [active])

  if (settingsIsLoading && !unlocked) {
    return <LoadingScreen />
  }

  // handles the top color behind the clock
  const styles = StyleSheet.create({
    top: {
      backgroundColor: topColor,
      paddingTop: insets.top,
      flex: 1,
    },
    body: {
      backgroundColor: topColor,
    },
  })

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
