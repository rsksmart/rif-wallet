import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenWithWallet } from '../../screens/types'
import { InjectedBrowser } from '../../ux/injectedBrowser/InjectedBrowser'
import { BookmarksScreen } from './BookmarksScreen'
import { StackParamList } from './types'
import { IRIFWalletServicesFetcher } from 'rif-wallet/packages/types'

const Stack = createStackNavigator<StackParamList>()

const screensOptions = { headerShown: true }

export type InjectedBrowserUXScreenProps = {
  fetcher: IRIFWalletServicesFetcher
}

export const InjectedBrowserNavigation: React.FC<
  ScreenWithWallet & InjectedBrowserUXScreenProps
> = ({ wallet, isWalletDeployed, fetcher }) => {
  return (
    <Stack.Navigator initialRouteName="Bookmarks">
      <Stack.Screen name="Bookmarks" options={screensOptions}>
        {props => (
          <BookmarksScreen
            {...props}
            isWalletDeployed={isWalletDeployed}
            wallet={wallet}
            fetcher={fetcher}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="InjectedBrowser" options={screensOptions}>
        {props => (
          <InjectedBrowser
            {...props}
            isWalletDeployed={isWalletDeployed}
            wallet={wallet}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
