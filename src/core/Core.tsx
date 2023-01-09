import { useCallback, useEffect, useMemo, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { RIFWallet } from 'lib/core'
import { i18nInit } from 'lib/i18n'

import {
  RootNavigationComponent,
  RootStackParamList,
  rootStackRouteNames,
} from 'navigation/rootNavigator'
import ModalComponent from '../ux/requestsModal/ModalComponent'

import {
  createNavigationContainerRef,
  NavigationContainer,
  NavigationState,
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
  selectKMS,
  selectRequests,
  selectSelectedWallet,
  selectSettingsIsLoading,
  selectTopColor,
  selectWallets,
  setChainId,
} from 'store/slices/settingsSlice'
import {
  hasKeys as hasKeysInStorage,
  hasPin as hasPinInStorage,
} from 'storage/MainStorage'
import { BitcoinProvider } from 'core/hooks/bitcoin/BitcoinContext'
import { getWalletSetting, SETTINGS } from './config'
import axios from 'axios'
import { RifWalletServicesAuth } from 'src/lib/rifWalletServices/RifWalletServicesAuth'
import { RifWalletServicesFetcher } from 'src/lib/rifWalletServices/RifWalletServicesFetcher'

export const navigationContainerRef =
  createNavigationContainerRef<RootStackParamList>()

export const Core = () => {
  const { hasKeys, hasPin } = useMemo(
    () => ({
      hasKeys: hasKeysInStorage(),
      hasPin: hasPinInStorage(),
    }),
    [],
  )
  const [fetcher, setFetcher] = useState<RifWalletServicesFetcher | undefined>(
    undefined)
  const dispatch = useAppDispatch()

  const selectedWallet = useAppSelector(selectSelectedWallet)
  const wallets = useAppSelector(selectWallets)
  const kms = useAppSelector(selectKMS)
  const settingsIsLoading = useAppSelector(selectSettingsIsLoading)
  const requests = useAppSelector(selectRequests)

  const insets = useSafeAreaInsets()
  const topColor = useAppSelector(selectTopColor)

  const BitcoinCore = useBitcoinCore()

  const { unlocked, active } = useStateSubscription()

  const [currentScreen, setCurrentScreen] = useState<string>(
    rootStackRouteNames.Home,
  )
  const handleScreenChange = useCallback(
    (newState: NavigationState | undefined) => {
      if (newState && newState.routes[newState.index]) {
        setCurrentScreen(newState.routes[newState.index].name)
      } else {
        setCurrentScreen(rootStackRouteNames.Home)
      }
    },
    [],
  )

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
    mnemonic: kms ? kms.mnemonic : null,
    fetcher,
  })

  useEffect(() => {
    const fn = async () => {
      await i18nInit()
    }
    fn()
  }, [])

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

  if (hasKeys && hasPin && !unlocked) {
    return <RequestPIN />
  }

  return (
    <View style={styles.top}>
      <StatusBar backgroundColor={topColor} />
      {!active && <Cover />}
      <BitcoinProvider BitcoinCore={BitcoinCore}>
        <NavigationContainer
          onStateChange={handleScreenChange}
          ref={navigationContainerRef}>
          <WalletConnectProviderElement>
            <>
              <RootNavigationComponent currentScreen={currentScreen} />

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
