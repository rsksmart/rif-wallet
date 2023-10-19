import { useCallback, useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native'
import { RIFWallet } from '@rsksmart/rif-wallet-core'

import {
  RootNavigationComponent,
  RootTabsParamsList,
} from 'navigation/rootNavigator'
import { RequestHandler } from 'src/ux/requestsModal/RequestHandler'
import { LoadingScreen } from 'components/loading/LoadingScreen'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  closeRequest,
  selectRequests,
  selectTopColor,
  selectWholeSettingsState,
  unlockApp,
} from 'store/slices/settingsSlice'
import { sharedStyles } from 'shared/constants'
import { WalletConnect2Provider } from 'screens/walletConnect/WalletConnect2Context'
import { WalletProvider } from 'shared/wallet'

import { useStateSubscription } from './hooks/useStateSubscription'
import { Cover } from './components/Cover'
import { useIsOffline } from './hooks/useIsOffline'

export const navigationContainerRef =
  createNavigationContainerRef<RootTabsParamsList>()

export const Core = () => {
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectWholeSettingsState)
  const requests = useAppSelector(selectRequests)
  const topColor = useAppSelector(selectTopColor)
  const isOffline = useIsOffline()
  const { unlocked, active } = useStateSubscription()
  const [wallet, setWallet] = useState<RIFWallet | null>(null)

  const unlockAppFn = useCallback(async () => {
    try {
      await dispatch(unlockApp({ isOffline })).unwrap()
    } catch (err) {
      console.log('ERR CORE', err)
    }
  }, [dispatch, isOffline])

  useEffect(() => {
    unlockAppFn()
  }, [unlockAppFn])

  /**
   * Obs: calling selectWalletState will throw an error since the wallet is not yet ready.
   * So we need to retrieve the wallet from the settings state.
   */
  useEffect(() => {
    const { wallets, walletsIsDeployed, selectedWallet } = settings
    if (wallets && walletsIsDeployed) {
      setWallet(wallets[selectedWallet])
    }
  }, [settings, wallet])

  return (
    <SafeAreaProvider>
      <View style={sharedStyles.flex}>
        <StatusBar backgroundColor={topColor} />
        {!active && <Cover />}
        <NavigationContainer ref={navigationContainerRef}>
          <WalletProvider>
            <WalletConnect2Provider wallet={wallet}>
              {settings.loading && !unlocked ? (
                <LoadingScreen />
              ) : (
                <>
                  <RootNavigationComponent />
                  {requests.length !== 0 && (
                    <RequestHandler
                      request={requests[0]}
                      closeRequest={() => dispatch(closeRequest())}
                    />
                  )}
                </>
              )}
            </WalletConnect2Provider>
          </WalletProvider>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  )
}
