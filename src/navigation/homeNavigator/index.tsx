import { createStackNavigator } from '@react-navigation/stack'

import { InjectedScreens } from 'core/Core'
import { HomeStackParamsList, homeStackRouteNames } from './types'
import { BitcoinReceiveScreen, ReceiveScreenHOC } from 'screens/index'

const HomeStack = createStackNavigator<HomeStackParamsList>()

export const HomeNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name={homeStackRouteNames.Main}
        component={InjectedScreens.HomeScreen}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Send}
        component={InjectedScreens.SendScreen}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.ManuallyDeployScreen}
        component={InjectedScreens.ManuallyDeployScreen}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Receive}
        component={ReceiveScreenHOC}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.ReceiveBitcoin}
        component={BitcoinReceiveScreen}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Balances}
        component={InjectedScreens.BalancesScreen}
      />
    </HomeStack.Navigator>
  )
}
