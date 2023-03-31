import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { InjectedScreens } from 'core/Core'
import { ReceiveScreen } from 'screens/index'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { HomeStackParamsList, homeStackRouteNames } from './types'
import { screenOptionsWithAppHeader, screenOptionsWithHeader } from '..'

const HomeStack = createStackNavigator<HomeStackParamsList>()

export const HomeNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Home>) => {
  const { top } = useSafeAreaInsets()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name={homeStackRouteNames.Main}
        component={InjectedScreens.HomeScreen}
        options={screenOptionsWithAppHeader}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Send}
        component={InjectedScreens.SendScreen}
        options={screenOptionsWithHeader(top)}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.RelayDeployScreen}
        component={InjectedScreens.RelayDeployScreen}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Receive}
        component={ReceiveScreen}
        options={screenOptionsWithHeader(top)}
      />
      <HomeStack.Screen
        name={homeStackRouteNames.Balances}
        component={InjectedScreens.BalancesScreen}
      />
    </HomeStack.Navigator>
  )
}
