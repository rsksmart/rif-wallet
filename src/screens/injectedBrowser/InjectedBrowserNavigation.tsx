import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenWithWallet } from '../../screens/types'
import { InjectedBrowser } from '../../ux/injectedBrowser/InjectedBrowser'
import { BookmarksScreen } from './BookmarksScreen'
import { StackParamList } from './types'

const Stack = createStackNavigator<StackParamList>()

const screensOptions = { headerShown: true }

export const InjectedBrowserNavigation: React.FC<ScreenWithWallet> = ({
  wallet,
}) => {
  return (
    <Stack.Navigator initialRouteName="Bookmarks">
      <Stack.Screen
        name="Bookmarks"
        options={screensOptions}
        component={BookmarksScreen}
      />
      <Stack.Screen name="InjectedBrowser" options={screensOptions}>
        {props => <InjectedBrowser {...props} wallet={wallet} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
