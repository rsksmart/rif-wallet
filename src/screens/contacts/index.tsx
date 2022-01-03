import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ContactsScreen } from './ContactsScreen'
import { EditContactScreen } from './EditContactScreen'
import { ContactsProviderElement } from './ContactsContext'

const Stack = createStackNavigator()

const screensOptions = { headerShown: false }

export const ContactsNavigationScreen: React.FC = () => {
  return (
    <ContactsProviderElement>
      <Stack.Navigator initialRouteName={'ContactsList'}>
        <Stack.Screen
          name="ContactsList"
          component={ContactsScreen}
          options={screensOptions}
        />
        <Stack.Screen
          name="ContactEdit"
          component={EditContactScreen}
          options={screensOptions}
        />
      </Stack.Navigator>
    </ContactsProviderElement>
  )
}
