import React, { useState, useRef, useEffect, Fragment } from 'react'
import {
  AppState,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { AppContext, Wallets, WalletsIsDeployed, Requests } from '../Context'

import { KeyManagementSystem, OnRequest, RIFWallet } from '../lib/core'
import { i18nInit } from '../lib/i18n'

import {
  hasKeys,
  loadExistingWallets,
  creteKMS,
  deleteKeys,
  addNextWallet,
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
import { colors } from '../styles/colors'

const gracePeriod = 3000

let timer: NodeJS.Timeout

type State = {
  hasKeys: boolean
  kms: KeyManagementSystem | null
  wallets: Wallets
  walletsIsDeployed: WalletsIsDeployed
  selectedWallet: string
  loading: boolean
  chainId?: number
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
  chainId: undefined,
}

const useRequests = () => {
  const [requests, setRequests] = useState<Requests>([])

  const onRequest: OnRequest = request => setRequests([request])
  const closeRequest = () => setRequests([] as Requests)

  return { requests, onRequest, closeRequest }
}

const useKeyManagementSystem = (onRequest: OnRequest) => {
  const [state, setState] = useState(initialState)

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
  }

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

  const addNewWallet = () => {
    if (!state.kms) {
      throw Error('Can not add new wallet because no KMS created.')
    }

    return addNextWallet(state.kms, createRIFWallet, networkId).then(response =>
      setState({
        ...state,
        wallets: Object.assign(state.wallets, {
          [response.rifWallet.address]: response.rifWallet,
        }),
        walletsIsDeployed: Object.assign(state.walletsIsDeployed, {
          [response.rifWallet.address]: response.isDeloyed,
        }),
      }),
    )
  }

  const switchActiveWallet = (address: string) =>
    setState({ ...state, selectedWallet: address })

  return {
    state,
    setState,
    createFirstWallet,
    addNewWallet,
    unlockApp,
    removeKeys,
    switchActiveWallet,
  }
}

export const Core = () => {
  const [active, setActive] = useState(true)
  const [unlocked, setUnlocked] = useState(false)

  const timerRef = useRef<NodeJS.Timeout>(timer)

  const { requests, onRequest, closeRequest } = useRequests()
  const {
    state,
    setState,
    createFirstWallet,
    addNewWallet,
    unlockApp,
    removeKeys,
    switchActiveWallet,
  } = useKeyManagementSystem(onRequest)

  const [currentScreen, setCurrentScreen] = useState<string>('Home')
  const handleScreenChange = (newState: NavigationState | undefined) =>
    setCurrentScreen(
      newState ? newState.routes[newState.routes.length - 1].name : 'Home',
    )

  const retrieveChainId = (wallet: RIFWallet) =>
    wallet.getChainId().then(chainId => setState({ ...state, chainId }))

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

  useEffect(() => {
    if (state.selectedWallet) {
      const currentWallet = state.wallets[state.selectedWallet]
      retrieveChainId(currentWallet)
    }
  }, [state.selectedWallet])

  if (state.loading) {
    return <LoadingScreen reason="Getting things setup" />
  }

  return (
    <Fragment>
      <SafeAreaView style={styles.top}>
        <StatusBar barStyle="light-content" />
      </SafeAreaView>
      <SafeAreaView style={styles.parent}>
        {!active && <Cover />}
        {state.hasKeys && !unlocked && (
          <RequestPIN
            unlock={() => unlockApp().then(() => setUnlocked(true))}
          />
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
                  injectedBrowserUXScreenProps={{
                    fetcher: rifWalletServicesFetcher,
                  }}
                  contactsNavigationScreenProps={{ rnsResolver }}
                  dappsScreenProps={{ fetcher: rifWalletServicesFetcher }}
                  manageWalletScreenProps={{
                    addNewWallet,
                    switchActiveWallet,
                  }}
                  settingsScreen={{ deleteKeys }}
                />

                {requests.length !== 0 && (
                  <ModalComponent
                    closeModal={closeRequest}
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

const styles = StyleSheet.create({
  top: {
    flex: 0,
    backgroundColor: colors.blue,
  },
  parent: {
    backgroundColor: colors.darkPurple,
  },
})
