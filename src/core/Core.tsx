import { useCallback, useEffect } from 'react'
import { StatusBar, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native'

import { i18nInit } from 'lib/i18n'

import {
  RootNavigationComponent,
  RootTabsParamsList,
} from 'navigation/rootNavigator'
import { RequestHandler } from 'src/ux/requestsModal/RequestHandler'
import { WalletConnectProviderElement } from 'screens/walletConnect/WalletConnectContext'
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

import { useStateSubscription } from './hooks/useStateSubscription'
import { Cover } from './components/Cover'

export const navigationContainerRef =
  createNavigationContainerRef<RootTabsParamsList>()

export const Core = () => {
  const dispatch = useAppDispatch()

  const settings = useAppSelector(selectWholeSettingsState)
  const requests = useAppSelector(selectRequests)
  const topColor = useAppSelector(selectTopColor)

  const { unlocked, active } = useStateSubscription()

  useEffect(() => {
    const fn = async () => {
      await i18nInit()
    }
    fn()
  }, [])

  const unlockAppSetMnemonic = useCallback(async () => {
    try {
      await dispatch(unlockApp()).unwrap()
    } catch (err) {
      console.log('ERR CORE', err)
    }
  }, [dispatch])

  useEffect(() => {
    unlockAppSetMnemonic()
  }, [unlockAppSetMnemonic])

  return (
    <SafeAreaProvider>
      <View style={sharedStyles.flex}>
        <StatusBar backgroundColor={topColor} />
        {!active && <Cover />}
        <NavigationContainer ref={navigationContainerRef}>
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
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  )
}
