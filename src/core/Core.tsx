import React, { useState, useRef, useEffect } from 'react'
import { AppState, SafeAreaView, StatusBar } from 'react-native'
import { AppContext, Wallets, WalletsIsDeployed, Requests } from '../Context'

import { KeyManagementSystem, OnRequest } from '../lib/core'
import { i18nInit } from '../lib/i18n'

import {
  hasKeys,
  loadExistingWallets,
  creteKMS,
  deleteKeys,
} from './operations'
import {
  rifWalletServicesFetcher,
  rnsResolver,
  abiEnhancer,
  createRIFWalletFactory,
  networkId,
  rifWalletServicesSocket,
} from './setup'

import { RootNavigation } from '../RootNavigation'
import ModalComponent from '../ux/requestsModal/ModalComponent'

import { Cover } from './components/Cover'
import { LoadingScreen } from './components/LoadingScreen'
import { RequestPIN } from './components/RequestPIN'
import { WalletConnectProviderElement } from '../screens/walletConnect/WalletConnectContext'
import { RIFSocketsProvider } from '../subscriptions/RIFSockets'
import { NavigationContainer, NavigationState } from '@react-navigation/native'

const gracePeriod = 3000

let timer: NodeJS.Timeout

type State = {
  hasKeys: boolean
  kms: KeyManagementSystem | null
  wallets: Wallets
  walletsIsDeployed: WalletsIsDeployed
  selectedWallet: string
  loading: boolean
}

const noKeysState = {
  kms: null,
  wallets: {},
  walletsIsDeployed: {},
  selectedWallet: '',
}

const initialState: State = {
  hasKeys: false,
  ...noKeysState,
  loading: true,
}

export const Core = () => {
  const [state, setState] = useState(initialState)

  const [active, setActive] = useState(true)
  const [unlocked, setUnlocked] = useState(false)

  const timerRef = useRef<NodeJS.Timeout>(timer)

  const [requests, setRequests] = useState<Requests>([])

  const [currentScreen, setCurrentScreen] = useState<string>('Home')
  const handleScreenChange = (newState: NavigationState | undefined) =>
    setCurrentScreen(
      newState ? newState.routes[newState.routes.length - 1].name : 'Home',
    )


  const removeKeys = () => {
    setState({ ...state, ...noKeysState })
  }

  const setKeys = (
    kms: KeyManagementSystem,
    wallets: Wallets,
    walletsIsDeployed: WalletsIsDeployed,
  ) => {
    setState({
      hasKeys: true,
      kms,
      wallets,
      walletsIsDeployed,
      selectedWallet: wallets[Object.keys(wallets)[0]].address,
      loading: false,
    })
    setUnlocked(true)
  }

  const onRequest: OnRequest = request => setRequests([request])
  const closeRequest = () => setRequests([] as Requests)

  const createRIFWallet = createRIFWalletFactory(onRequest)

  const handleLoadExistingWallets = loadExistingWallets(createRIFWallet)
  const handleCreateKMS = creteKMS(createRIFWallet, networkId) // using only testnet

  const unlockApp = async () => {
    setState({ ...state, loading: true })
    const { kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary } =
      await handleLoadExistingWallets()
    setKeys(kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary)
  }

  const createFirstWallet = async (mnemonic: string) => {
    setState({ ...state, loading: true })
    const {
      kms,
      rifWallet,
      rifWalletsDictionary,
      rifWalletsIsDeployedDictionary,
    } = await handleCreateKMS(mnemonic)
    setKeys(kms, rifWalletsDictionary, rifWalletsIsDeployedDictionary)
    return rifWallet
  }

  useEffect(() => {
    const stateSubscription = AppState.addEventListener(
      'change',
      appStateStatus => {
        const isNowActive = appStateStatus === 'active'
        setActive(isNowActive)

        if (unlocked) {
          if (!isNowActive) {
            const newTimer = setTimeout(() => {
              setUnlocked(false)
              removeKeys()
            }, gracePeriod)

            timerRef.current = newTimer
          } else {
            if (timerRef.current) {
              clearTimeout(timerRef.current)
            }
          }
        }
      },
    )

    return () => {
      stateSubscription.remove()
    }
  }, [unlocked])

  useEffect(() => {
    Promise.all([i18nInit(), hasKeys()]).then(([_, hasKeysResult]) => {
      setState({ ...state, hasKeys: !!hasKeysResult, loading: false })
    })
  }, [])

  return (
    <SafeAreaView>
      <StatusBar />
      {state.loading && <LoadingScreen reason="Please wait..." />}
      {!active && <Cover />}
      {state.hasKeys && !unlocked && <RequestPIN unlock={unlockApp} />}
      <AppContext.Provider
        value={{
          ...state,
          setRequests,
          mnemonic: state.kms?.mnemonic,
        }}>
        <NavigationContainer onStateChange={handleScreenChange}>
          <WalletConnectProviderElement>
            <RIFSocketsProvider rifServiceSocket={rifWalletServicesSocket} abiEnhancer={abiEnhancer}>
              <RootNavigation
                currentScreen={currentScreen}
                rifWalletServicesSocket={rifWalletServicesSocket}
                keyManagementProps={{
                  generateMnemonic: () => KeyManagementSystem.create().mnemonic,
                  createFirstWallet,
                }}
                balancesScreenProps={{ fetcher: rifWalletServicesFetcher }}
                sendScreenProps={{ rnsResolver }}
                activityScreenProps={{
                  fetcher: rifWalletServicesFetcher,
                  abiEnhancer,
                }}
                keysInfoScreenProps={{
                  mnemonic: state.kms?.mnemonic || '',
                  deleteKeys,
                }}
                injectedBrowserUXScreenProps={{ fetcher: rifWalletServicesFetcher }}
                contactsNavigationScreenProps={{ rnsResolver }}
                dappsScreenProps={{ fetcher: rifWalletServicesFetcher }}
              />

              {requests.length !== 0 && (
                <ModalComponent closeModal={closeRequest} request={requests[0]} />
              )}
            </RIFSocketsProvider>
          </WalletConnectProviderElement>
        </NavigationContainer>
      </AppContext.Provider>
    </SafeAreaView>
  )
}
