import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import WalletApp from './App'
import ReviewTransactionComponent from './modal/ReviewTransactionComponent'
import { LogBox } from 'react-native'

// "If you don't use state persistence or deep link to the screen which accepts functions in params, then the warning doesn't affect you and you can safely ignore it."
// ref: https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

interface Interface {}

const RootNavigation: React.FC<Interface> = () => {
  const RootStack = createStackNavigator()
  const sharedOptions = { headerShown: false }

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Group>
          <RootStack.Screen
            name="Home"
            component={WalletApp}
            options={sharedOptions}
          />
        </RootStack.Group>
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen
            name="ReviewTransaction"
            component={ReviewTransactionComponent}
            options={sharedOptions}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigation
