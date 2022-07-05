import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ScanQRScreen from './ScanQRScreen'
import { ScreenProps } from '../../RootNavigation'
import SessionRequestScreen from './SessionRequestScreen'
import ConnectedScreen from './ConnectedScreen'
import { ScreenWithWallet } from '../types'

const Stack = createStackNavigator()

const screensOptions = { headerShown: false }

export const WalletConnectNavigationScreen: React.FC<
  ScreenProps<'WalletConnect'> & ScreenWithWallet
> = () => {
  return (
    <Stack.Navigator initialRouteName={'ScanQR'}>
      <Stack.Screen
        name="ScanQR"
        component={ScanQRScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name="SessionRequest"
        component={SessionRequestScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name="Connected"
        component={ConnectedScreen}
        options={screensOptions}
      />
    </Stack.Navigator>
  )
}
