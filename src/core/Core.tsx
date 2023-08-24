import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { StatusBar, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { Config } from 'react-native-config'

import { i18nInit } from 'lib/i18n'

import {
  RootNavigationComponent,
  RootTabsParamsList,
} from 'navigation/rootNavigator'
import { RequestHandler } from 'src/ux/requestsModal/RequestHandler'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  closeRequest,
  selectRequests,
  selectTopColor,
  selectWalletState,
  unlockApp,
} from 'store/slices/settingsSlice'
import { sharedStyles } from 'shared/constants'
import { ChainTypeEnum } from 'shared/constants/chainConstants'
import { WalletIsDeployed } from 'store/slices/settingsSlice/types'

import { useStateSubscription } from './hooks/useStateSubscription'
import { Cover } from './components/Cover'
import { useIsOffline } from './hooks/useIsOffline'

export const navigationContainerRef =
  createNavigationContainerRef<RootTabsParamsList>()

interface MagicContext {
  wallet: RIFWallet
  walletIsDeployed: WalletIsDeployed
  chainId: 31
  chainType: ChainTypeEnum
}

export const MagicContext = createContext<MagicContext | null>(null)

export let setMagicContextFunction: Dispatch<
  SetStateAction<MagicContext | null>
> | null = null

export const useAppropriateWalletState = () => {
  const magicWallet = useContext(MagicContext)
  const { wallet, walletIsDeployed, chainId, chainType } =
    useAppSelector(selectWalletState)

  if (!Config.MAGIC_ENABLED === 'true') {
    if (!wallet || !walletIsDeployed) {
      throw new Error('NO WALLET IN STATE')
    }
    return {
      wallet,
      walletIsDeployed,
      chainId,
      chainType,
    }
  }

  if (!magicWallet) {
    throw new Error('NO WALLET IN STATE')
  }

  return {
    wallet: magicWallet.wallet,
    walletIsDeployed: magicWallet.walletIsDeployed,
    chainId: magicWallet.chainId,
    chainType: magicWallet.chainType,
  }
}

export const Core = () => {
  const [magicContext, setMagicContext] = useState<MagicContext | null>(null)
  setMagicContextFunction = setMagicContext
  const [i18nextInitialized, seti18nextInitialized] = useState(false)
  const dispatch = useAppDispatch()
  const requests = useAppSelector(selectRequests)
  const topColor = useAppSelector(selectTopColor)
  const isOffline = useIsOffline()

  const { active } = useStateSubscription()

  useEffect(() => {
    const fn = async () => {
      await i18nInit()
      seti18nextInitialized(true)
    }
    fn()
  }, [])

  const unlockAppSetMnemonic = useCallback(async () => {
    try {
      await dispatch(unlockApp({ isOffline })).unwrap()
    } catch (err) {
      console.log('ERR CORE', err)
    }
  }, [dispatch, isOffline])

  useEffect(() => {
    unlockAppSetMnemonic()
  }, [unlockAppSetMnemonic])

  //TODO: show Splash Screen until translation
  // is initialized

  return !i18nextInitialized ? (
    <View />
  ) : (
    <SafeAreaProvider style={sharedStyles.flex}>
      <StatusBar backgroundColor={topColor} />
      {!active && <Cover />}
      <NavigationContainer ref={navigationContainerRef}>
        <MagicContext.Provider value={magicContext}>
          <RootNavigationComponent />
          {requests.length !== 0 && (
            <RequestHandler
              request={requests[0]}
              closeRequest={() => dispatch(closeRequest())}
            />
          )}
        </MagicContext.Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
