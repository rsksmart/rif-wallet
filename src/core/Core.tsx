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
import { InjectSelectedWallet } from 'src/Context'
import * as Screens from 'screens/index'
import { sharedStyles } from 'src/shared/constants'

import { useStateSubscription } from './hooks/useStateSubscription'
import { Cover } from './components/Cover'

export const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  BalancesScreen: InjectSelectedWallet(Screens.BalancesScreen),
  ActivityScreen: InjectSelectedWallet(Screens.ActivityScreen),
  ActivityDetailsScreen: InjectSelectedWallet(Screens.ActivityDetailsScreen),
  RelayDeployScreen: InjectSelectedWallet(Screens.RelayDeployScreen),
  WalletConnectScreen: InjectSelectedWallet(Screens.WalletConnectScreen),
  ScanQRScreen: InjectSelectedWallet(Screens.ScanQRScreen),
  SearchDomainScreen: InjectSelectedWallet(Screens.SearchDomainScreen),
  AliasBoughtScreen: InjectSelectedWallet(Screens.AliasBoughtScreen),
  HomeScreen: InjectSelectedWallet(Screens.HomeScreen),
  AccountsScreen: InjectSelectedWallet(Screens.AccountsScreen),
  PurchaseDomainScreen: InjectSelectedWallet(Screens.PurchaseDomainScreen),
}

export const navigationContainerRef =
  createNavigationContainerRef<RootTabsParamsList>()

export const Core = () => {
  const dispatch = useAppDispatch()

  const settings = useAppSelector(selectWholeSettingsState)
  const requests = useAppSelector(selectRequests)
  const [mnemonic, setMnemonic] = useState<string | null>(null)
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
      const kms = await dispatch(unlockApp()).unwrap()

      setMnemonic(kms.mnemonic)
    } catch (err) {
      if (typeof err === 'string') {
        // If no wallets - reset mnemonic...
        if (err.includes('No Existing wallets')) {
          setMnemonic(null)
        }
      }
      console.log('ERRR', err)
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
          <WalletConnectProviderElement>
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
          </WalletConnectProviderElement>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  )
}
