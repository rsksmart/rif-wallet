import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { NavigationProp } from '../../RootNavigation'
import { ContactFormScreen } from './ContactFormScreen'
import { ContactsProviderElement } from './ContactsContext'
import { ContactsScreen } from './ContactsScreen'
import { EditContactScreen } from './EditContactScreen'

const Stack = createStackNavigator()

const screensOptions = { headerShown: false }

export type ContactsScreenProps = {
  navigation: NavigationProp
}

export const ContactsNavigationScreen: React.FC<ContactsScreenProps> = ({
  navigation,
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
          {props => <EditContactScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="ContactForm" options={screensOptions}>
          {props => <ContactFormScreen {...props} navigation={navigation} />}
        </Stack.Screen>
      </Stack.Navigator>
    </ContactsProviderElement>
  )
}
