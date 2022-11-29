import { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { AppContext } from '../Context'
import { KeyManagementSystem, RIFWallet } from '../lib/core'
import { i18nInit } from '../lib/i18n'

import { hasKeys, hasPin } from '../storage/MainStorage'
import {
  abiEnhancer,
  rifWalletServicesFetcher,
  rifWalletServicesSocket,
  rnsResolver,
} from './setup'

import {
  RootNavigationComponent,
  RootStackParamList,
} from '../navigation/rootNavigator'
import ModalComponent from '../ux/requestsModal/ModalComponent'

import {
  createNavigationContainerRef,
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native'
import { useSetGlobalError } from '../components/GlobalErrorHandler'
import { LoadingScreen } from '../components/loading/LoadingScreen'
import { WalletConnectProviderElement } from '../screens/walletConnect/WalletConnectContext'
import { colors } from '../styles'
import { RIFSocketsProvider } from '../subscriptions/RIFSockets'
import { Cover } from './components/Cover'
import { RequestPIN } from './components/RequestPIN'
import { useBitcoinCore } from './hooks/bitcoin/useBitcoinCore'
import { useKeyboardIsVisible } from './hooks/useKeyboardIsVisible'
import { useKeyManagementSystem } from './hooks/useKeyManagementSystem'
import { useRequests } from './hooks/useRequests'
import { useStateSubscription } from './hooks/useStateSubscription'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const navigationContainerRef =
  createNavigationContainerRef<RootStackParamList>()

export const Core = () => {
  const insets = useSafeAreaInsets()
  const [topColor, setTopColor] = useState(colors.darkPurple3)

  const { requests, onRequest, closeRequest } = useRequests()
  const {
    state,
    setState,
    createFirstWallet,
    addNewWallet,
    unlockApp,
    removeKeys,
    switchActiveWallet,
    createPin,
    editPin,
    resetKeysAndPin,
    setWalletIsDeployed,
  } = useKeyManagementSystem(onRequest)

  const onScreenLock = removeKeys

  const { unlocked, setUnlocked, active } = useStateSubscription(onScreenLock)
  const isKeyboardVisible = useKeyboardIsVisible()

  const [currentScreen, setCurrentScreen] = useState<string>('Home')
  const handleScreenChange = (newState: NavigationState | undefined) =>
    setCurrentScreen(
      newState ? newState.routes[newState.routes.length - 1].name : 'Home',
    )

  const setGlobalError = useSetGlobalError()

  const onScreenUnlock = () => {
    unlockApp()
      .then(() => setUnlocked(true))
      .catch(err => setGlobalError(err.toString()))
  }

  const retrieveChainId = (wallet: RIFWallet) =>
    wallet.getChainId().then(chainId => setState({ ...state, chainId }))

  const BitcoinCore = useBitcoinCore(state?.kms?.mnemonic || '', onRequest)

  useEffect(() => {
    i18nInit().then(() => {
      setState({
        ...state,
        hasKeys: hasKeys(),
        hasPin: hasPin(),
        loading: false,
      })
    })
  }, [])

  useEffect(() => {
    if (state.selectedWallet) {
      const currentWallet = state.wallets[state.selectedWallet]
      retrieveChainId(currentWallet)
    }
  }, [state.selectedWallet])

  if (state.loading) {
    return <LoadingScreen />
  }

  // handles the top color behind the clock
  const styles = StyleSheet.create({
    top: { backgroundColor: topColor, paddingTop: insets.top, flex: 1 },
    body: {
      backgroundColor: topColor,
    },
  })

  const handleUpdatePin = (newPin: string) => {
    editPin(newPin)
    setState({ ...state, hasPin: true })
  }

  if (state.hasKeys && state.hasPin && !unlocked) {
    return (
      <RequestPIN unlock={onScreenUnlock} resetKeysAndPin={resetKeysAndPin} />
    )
  }

  return (
    <View style={styles.top}>
      <StatusBar backgroundColor={topColor} />
      {!active && <Cover />}
      <AppContext.Provider
        value={{
          ...state,
          mnemonic: state.kms?.mnemonic,
          BitcoinCore,
        }}>
        <NavigationContainer
          onStateChange={handleScreenChange}
          ref={navigationContainerRef}>
          <WalletConnectProviderElement>
            <RIFSocketsProvider
              rifServiceSocket={rifWalletServicesSocket}
              abiEnhancer={abiEnhancer}
              appActive={active}>
              <RootNavigationComponent
                currentScreen={currentScreen}
                hasKeys={state.hasKeys}
                hasPin={state.hasPin}
                isKeyboardVisible={isKeyboardVisible}
                rifWalletServicesSocket={rifWalletServicesSocket}
                keyManagementProps={{
                  generateMnemonic: () => KeyManagementSystem.create().mnemonic,
                  createFirstWallet: (mnemonic: string) =>
                    createFirstWallet(mnemonic).then(wallet => {
                      setUnlocked(true)
                      return wallet
                    }),
                }}
                createPin={createPin}
                editPin={handleUpdatePin}
                setWalletIsDeployed={setWalletIsDeployed}
                balancesScreenProps={{ fetcher: rifWalletServicesFetcher }}
                sendScreenProps={{ rnsResolver }}
                activityScreenProps={{
                  fetcher: rifWalletServicesFetcher,
                  abiEnhancer,
                }}
                showMnemonicScreenProps={{
                  mnemonic: state.kms?.mnemonic || '',
                }}
                contactsNavigationScreenProps={{ rnsResolver }}
                accountsScreenType={{
                  addNewWallet,
                  switchActiveWallet,
                }}
                securityConfigurationScreenProps={{
                  deleteKeys: resetKeysAndPin,
                }}
                changeTopColor={setTopColor}
              />

              {requests.length !== 0 && (
                <ModalComponent
                  closeModal={closeRequest}
                  isKeyboardVisible={isKeyboardVisible}
                  request={requests[0]}
                />
              )}
            </RIFSocketsProvider>
          </WalletConnectProviderElement>
        </NavigationContainer>
      </AppContext.Provider>
    </View>
  )
}
