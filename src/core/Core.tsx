import { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { RIFWallet } from 'lib/core'
import { i18nInit } from 'lib/i18n'

import { abiEnhancer, rifWalletServicesSocket } from './setup'

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
import { useSetGlobalError } from 'components/GlobalErrorHandler'
import { Cover } from './components/Cover'
import { RequestPIN } from './components/RequestPIN'
import { useBitcoinCore } from './hooks/bitcoin/useBitcoinCore'
import { useStateSubscription } from './hooks/useStateSubscription'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  closeRequest,
  onRequest,
  removeKeysFromState,
  resetKeysAndPin,
  selectKMS,
  selectRequests,
  selectSelectedWallet,
  selectSettingsIsLoading,
  selectTopColor,
  selectWallets,
  setChainType,
  unlockApp,
} from 'store/slices/settingsSlice'
import { hasKeys, hasPin } from 'storage/MainStorage'
import { BitcoinProvider } from 'core/hooks/bitcoin/BitcoinContext'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'

export const navigationContainerRef =
  createNavigationContainerRef<RootStackParamList>()

export const Core = () => {
  const dispatch = useAppDispatch()

  const selectedWallet = useAppSelector(selectSelectedWallet)
  const wallets = useAppSelector(selectWallets)
  const kms = useAppSelector(selectKMS)
  const settingsIsLoading = useAppSelector(selectSettingsIsLoading)
  const requests = useAppSelector(selectRequests)

  const insets = useSafeAreaInsets()
  const topColor = useAppSelector(selectTopColor)

  const BitcoinCore = useBitcoinCore(kms?.mnemonic || '', request =>
    dispatch(onRequest({ request })),
  )
  const onScreenLock = () => dispatch(removeKeysFromState())

  const { unlocked, setUnlocked, active } = useStateSubscription(onScreenLock)

  const [currentScreen, setCurrentScreen] = useState<string>(
    rootStackRouteNames.Home,
  )
  const handleScreenChange = (newState: NavigationState | undefined) => {
    if (newState && newState.routes[newState.index]) {
      setCurrentScreen(newState.routes[newState.index].name)
    } else {
      setCurrentScreen(rootStackRouteNames.Home)
    }
  }

  const setGlobalError = useSetGlobalError()

  const onScreenUnlock = async () => {
    try {
      await dispatch(unlockApp())
      setUnlocked(true)
    } catch (err) {
      setGlobalError(err.toString())
    }
  }

  const retrieveChainId = async (wallet: RIFWallet) => {
    const chainId = await wallet.getChainId()
    dispatch(
      setChainType(
        chainId === 31 ? ChainTypeEnum.TESTNET : ChainTypeEnum.MAINNET,
      ),
    )
  }

  useRifSockets({
    rifServiceSocket: rifWalletServicesSocket,
    abiEnhancer,
    appActive: active,
    wallet: wallets && wallets[selectedWallet],
    mnemonic: kms?.mnemonic,
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
    }
  }, [selectedWallet])

  if (settingsIsLoading) {
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
    return (
      <RequestPIN
        unlock={onScreenUnlock}
        resetKeysAndPin={() => dispatch(resetKeysAndPin())}
      />
    )
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
            <RootNavigationComponent currentScreen={currentScreen} />

            {requests.length !== 0 && (
              <ModalComponent
                closeModal={() => dispatch(closeRequest())}
                request={requests[0]}
              />
            )}
          </WalletConnectProviderElement>
        </NavigationContainer>
      </BitcoinProvider>
    </View>
  )
}
