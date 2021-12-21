import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ScanQRScreen from './ScanQRScreen'
import { ScreenProps } from '../../RootNavigation'
import { WalletConnectContext } from './WalletConnectContext'
import SessionRequestScreen from './SessionRequestScreen'
import ConnectedScreen from './ConnectedScreen'
import { ScreenWithWallet } from '../types'

const Stack = createStackNavigator()

const screensOptions = { headerShown: true }

export const WalletConnectNavigationScreen: React.FC<
  ScreenProps<'WalletConnect'> & ScreenWithWallet
> = () => {
  const { isConnected } = useContext(WalletConnectContext)

  return (
    <Stack.Navigator initialRouteName={isConnected ? 'Connected' : 'ScanQR'}>
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
