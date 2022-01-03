import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ContactsScreen } from './ContactsScreen'
import { EditContactScreen } from './EditContactScreen'
import { ContactsProviderElement } from './ContactsContext'
import Resolver from '@rsksmart/rns-resolver.js'

const Stack = createStackNavigator()

const screensOptions = { headerShown: false }

export const ContactsNavigationScreen: React.FC<{ rnsResolver: Resolver }> = ({
  rnsResolver,
}) => {
  return (
    <ContactsProviderElement>
      <Stack.Navigator initialRouteName={'ContactsList'}>
        <Stack.Screen
          name="ContactsList"
          component={ContactsScreen}
          options={screensOptions}
        />
        <Stack.Screen name="ContactEdit" options={screensOptions}>
          {props => <EditContactScreen {...props} rnsResolver={rnsResolver} />}
        </Stack.Screen>
      </Stack.Navigator>
    </ContactsProviderElement>
  )
}
