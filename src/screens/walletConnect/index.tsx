import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ScanQRScreen from './ScanQRScreen'
import { NavigationProp, ParamListBase } from '@react-navigation/core'
import { WalletConnectProviderElement } from './WalletConnectContext'
import SessionRequestScreen from './SessionRequestScreen'
import { RIFWallet } from '../../lib/core'
import ConnectedScreen from './ConnectedScreen'

const Stack = createStackNavigator()

const screensOptions = { headerShown: true }

interface IWalletConnectNavigationScreenProps {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const WalletConnectNavigationScreen: React.FC<IWalletConnectNavigationScreenProps> =
  ({ navigation, route }) => {
    const account = route.params.account as RIFWallet

    return (
      <WalletConnectProviderElement navigation={navigation} account={account}>
        <Stack.Navigator initialRouteName="ScanQR">
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
      </WalletConnectProviderElement>
    )
  }

export default WalletConnectNavigationScreen
