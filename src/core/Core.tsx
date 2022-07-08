import React, { useState, useRef, useEffect, Fragment } from 'react'
import {
  AppState,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Keyboard,
} from 'react-native'
import { AppContext, Wallets, WalletsIsDeployed, Requests } from '../Context'
import { KeyManagementSystem, OnRequest, RIFWallet } from '../lib/core'
import { i18nInit } from '../lib/i18n'
// import TextOverride from './TextGlobalOverride'
// TextOverride()

import {
  hasKeys,
  hasPin,
  loadExistingWallets,
  creteKMS,
  deleteKeys,
  addNextWallet,
} from './operations'
export { hasPin } from '../storage/PinStore'
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
import { LoadingScreen } from '../components/loading/LoadingScreen'
import { RequestPIN } from './components/RequestPIN'
import { WalletConnectProviderElement } from '../screens/walletConnect/WalletConnectContext'
import { RIFSocketsProvider } from '../subscriptions/RIFSockets'
import { NavigationContainer, NavigationState } from '@react-navigation/native'
import { colors } from '../styles'
import { deletePin, savePin } from '../storage/PinStore'
import { deleteContacts } from '../storage/ContactsStore'
import { deleteDomains } from '../storage/DomainsStore'
import {
  GlobalErrorHandler,
  useSetGlobalError,
} from '../components/GlobalErrorHandler'

const gracePeriod = 3000

let timer: NodeJS.Timeout

type State = {
  hasKeys: boolean
  hasPin: boolean
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
  hasPin: false,
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
  const resetKeysAndPin = async () => {
    deleteKeys()
    deletePin()
    deleteContacts()
    deleteDomains()
    setState({ ...initialState, loading: false })
  }

  const setKeys = (
    kms: KeyManagementSystem,
    wallets: Wallets,
    walletsIsDeployed: WalletsIsDeployed,
  ) => {
    setState({
      ...state,
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

  const createPin = async (newPin: string) => {
    setState({ ...state, loading: true })
    await savePin(newPin)
    setState({
      ...state,
      hasPin: true,
      loading: false,
    })
  }

  const editPin = async (newPin: string) => {
    await savePin(newPin)
  }

  const addNewWallet = () => {
    if (!state.kms) {
      throw Error('Can not add new wallet because no KMS created.')
    }

    return addNextWallet(state.kms, createRIFWallet, networkId).then(response =>
      setState(oldState => ({
        ...oldState,
        wallets: {
          ...oldState.wallets,
          [response.rifWallet.address]: response.rifWallet,
        },
        walletsIsDeployed: {
          ...oldState.walletsIsDeployed,
          [response.rifWallet.address]: response.isDeloyed,
        },
      })),
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
    createPin,
    resetKeysAndPin,
    editPin,
  }
}

export const Core = () => {
  const [active, setActive] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const [topColor, setTopColor] = useState(colors.darkPurple3)

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
    createPin,
    editPin,
    resetKeysAndPin,
  } = useKeyManagementSystem(onRequest)

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
                  keysInfoScreenProps={{
                    mnemonic: state.kms?.mnemonic || '',
                    deleteKeys,
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
    <Core />
  </GlobalErrorHandler>
)
