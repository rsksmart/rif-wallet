import React, { Fragment, useEffect, useState } from 'react'
import { Keyboard, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { AppContext } from '../Context'
import { KeyManagementSystem, RIFWallet } from '../lib/core'
import { i18nInit } from '../lib/i18n'

import { hasKeys, hasPin } from './operations'
import {
  abiEnhancer,
  rifWalletServicesFetcher,
  rifWalletServicesSocket,
  rnsResolver,
} from './setup'
export { hasPin } from '../storage/PinStore'

import { RootNavigation } from '../RootNavigation'
import ModalComponent from '../ux/requestsModal/ModalComponent'

import { NavigationContainer, NavigationState } from '@react-navigation/native'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import {
  GlobalErrorHandler,
  useSetGlobalError,
} from '../components/GlobalErrorHandler'
import { LoadingScreen } from '../components/loading/LoadingScreen'
import { WalletConnectProviderElement } from '../screens/walletConnect/WalletConnectContext'
import { colors } from '../styles'
import { RIFSocketsProvider } from '../subscriptions/RIFSockets'
import { Cover } from './components/Cover'
import { RequestPIN } from './components/RequestPIN'
import { useKeyManagementSystem } from './hooks/useKeyManagementSystem'
import { useRequests } from './hooks/useRequests'
import { useStateSubscription } from './hooks/useStateSubscription'

export const Core = () => {
  const [topColor, setTopColor] = useState(colors.darkPurple3)

  const { requests, onRequest, closeRequest } = useRequests()
  const {
    state,
    setState,
    createFirstWallet,
    addNewWallet,
    unlockApp,
    switchActiveWallet,
    createPin,
    editPin,
    resetKeysAndPin,
  } = useKeyManagementSystem(onRequest)

  const { unlocked, setUnlocked, active } = useStateSubscription(onRequest)

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

  useEffect(() => {
    Promise.all([i18nInit(), hasKeys(), hasPin()]).then(
      ([_, hasKeysResult, hasPinResult]) => {
        setState({
          ...state,
          hasKeys: !!hasKeysResult,
          hasPin: !!hasPinResult,
          loading: false,
        })
      },
    )
  }, [])

  useEffect(() => {
    if (state.selectedWallet) {
      const currentWallet = state.wallets[state.selectedWallet]
      retrieveChainId(currentWallet)
    }
  }, [state.selectedWallet])

  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      },
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  if (state.loading) {
    return <LoadingScreen />
  }

  // handles the top color behind the clock
  const styles = StyleSheet.create({
    top: {
      flex: 0,
      backgroundColor: topColor,
    },
    body: {
      backgroundColor: topColor,
    },
  })
  return (
    <Fragment>
      <SafeAreaView style={styles.top}>
        <StatusBar backgroundColor={topColor} />
      </SafeAreaView>
      <SafeAreaView style={styles.body}>
        {!active && <Cover />}
        {state.hasKeys && state.hasPin && !unlocked && (
          <RequestPIN unlock={onScreenUnlock} />
        )}
        <AppContext.Provider
          value={{
            ...state,
            mnemonic: state.kms?.mnemonic,
          }}>
          <NavigationContainer onStateChange={handleScreenChange}>
            <WalletConnectProviderElement>
              <RIFSocketsProvider
                rifServiceSocket={rifWalletServicesSocket}
                abiEnhancer={abiEnhancer}>
                <RootNavigation
                  currentScreen={currentScreen}
                  hasKeys={state.hasKeys}
                  hasPin={state.hasPin}
                  isKeyboardVisible={isKeyboardVisible}
                  rifWalletServicesSocket={rifWalletServicesSocket}
                  keyManagementProps={{
                    generateMnemonic: () =>
                      KeyManagementSystem.create().mnemonic,
                    createFirstWallet: (mnemonic: string) =>
                      createFirstWallet(mnemonic).then(wallet => {
                        setUnlocked(true)
                        return wallet
                      }),
                  }}
                  createPin={createPin}
                  editPin={editPin}
                  balancesScreenProps={{ fetcher: rifWalletServicesFetcher }}
                  sendScreenProps={{ rnsResolver }}
                  activityScreenProps={{
                    fetcher: rifWalletServicesFetcher,
                    abiEnhancer,
                  }}
                  showMnemonicScreenProps={{
                    mnemonic: state.kms?.mnemonic || '',
                  }}
                  injectedBrowserUXScreenProps={{
                    fetcher: rifWalletServicesFetcher,
                  }}
                  contactsNavigationScreenProps={{ rnsResolver }}
                  dappsScreenProps={{ fetcher: rifWalletServicesFetcher }}
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
      </SafeAreaView>
    </Fragment>
  )
}

export const CoreGlobalErrorHandler = () => (
  <GlobalErrorHandler>
    <ErrorBoundary>
      <Core />
    </ErrorBoundary>
  </GlobalErrorHandler>
)
