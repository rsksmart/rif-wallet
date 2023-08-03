import { useCallback, useEffect, useState } from 'react'
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
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  closeRequest,
  selectRequests,
  selectTopColor,
  unlockApp,
} from 'store/slices/settingsSlice'
import { sharedStyles } from 'shared/constants'

import { useStateSubscription } from './hooks/useStateSubscription'
import { Cover } from './components/Cover'
import { useIsOffline } from './hooks/useIsOffline'

export const navigationContainerRef =
  createNavigationContainerRef<RootTabsParamsList>()

export const Core = () => {
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
        <>
          <RootNavigationComponent />
          {requests.length !== 0 && (
            <RequestHandler
              request={requests[0]}
              closeRequest={() => dispatch(closeRequest())}
            />
          )}
        </>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
