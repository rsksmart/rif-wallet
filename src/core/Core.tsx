import { useCallback, useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import {
  RifWalletServicesAuth,
  RifWalletServicesFetcher,
} from '@rsksmart/rif-wallet-services'
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native'
import * as Keychain from 'react-native-keychain'

import { i18nInit } from 'lib/i18n'

import { defaultChainId } from 'core/config'
import {
  RootNavigationComponent,
  RootTabsParamsList,
} from 'navigation/rootNavigator'
import { ModalComponent } from 'src/ux/requestsModal/ModalComponent'
import { WalletConnectProviderElement } from 'screens/walletConnect/WalletConnectContext'
import {
  rifSockets,
  SocketsEvents,
  socketsEvents,
} from 'src/subscriptions/rifSockets'
import { LoadingScreen } from 'components/loading/LoadingScreen'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  closeRequest,
  selectRequests,
  selectSelectedWallet,
  selectTopColor,
  selectWallets,
  selectWholeSettingsState,
  setChainId,
  unlockApp,
} from 'store/slices/settingsSlice'
import { BitcoinProvider } from 'core/hooks/bitcoin/BitcoinContext'
import { InjectSelectedWallet } from 'src/Context'
import * as Screens from 'screens/index'
import { useSetGlobalError } from 'components/GlobalErrorHandler'
import { authClient } from 'src/core/setup'
import {
  deleteSignUp,
  getSignUP,
  hasSignUP,
  saveSignUp,
} from 'storage/MainStorage'
import { sharedStyles } from 'src/shared/constants'

import { authAxios, publicAxios } from './setup'
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
  const wallets = useAppSelector(selectWallets)
  const settings = useAppSelector(selectWholeSettingsState)
  const requests = useAppSelector(selectRequests)
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const setGlobalError = useSetGlobalError()
  const topColor = useAppSelector(selectTopColor)

  const BitcoinCore = useBitcoinCore(selectedWallet ? mnemonic : '', fetcher)
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
  }, [unlockAppSetMnemonic, selectedWallet])

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

  return (
    <SafeAreaProvider>
      <View style={sharedStyles.flex}>
        <StatusBar backgroundColor={topColor} />
        {!active && <Cover />}
        <BitcoinProvider BitcoinCore={BitcoinCore}>
          <NavigationContainer ref={navigationContainerRef}>
            <WalletConnectProviderElement>
              {settings.loading && !unlocked ? (
                <LoadingScreen />
              ) : (
                <>
                  <RootNavigationComponent />

                  {requests.length !== 0 && (
                    <ModalComponent
                      closeModal={() => dispatch(closeRequest())}
                      request={requests[0]}
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
