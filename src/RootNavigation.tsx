import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import WalletApp from './App'
import ReviewTransactionComponent from './modal/ReviewTransactionComponent'

interface Interface {

}

const RootNavigation: React.FC<Interface> = () => {
  const RootStack = createStackNavigator()
  const sharedOptions = { headerShown: false }

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Group>
          <RootStack.Screen name="Home" component={WalletApp} options={sharedOptions} />
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
