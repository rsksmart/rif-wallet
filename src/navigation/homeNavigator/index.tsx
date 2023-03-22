import { createStackNavigator } from '@react-navigation/stack'

import { InjectedScreens } from 'core/Core'
import { ReceiveScreen } from 'screens/index'

import { HomeStackParamsList, homeStackRouteNames } from './types'

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
        name={homeStackRouteNames.RelayDeployScreen}
        component={InjectedScreens.RelayDeployScreen}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Receive}
        component={ReceiveScreen}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Balances}
        component={InjectedScreens.BalancesScreen}
      />
    </HomeStack.Navigator>
  )
}
