import { createStackNavigator } from '@react-navigation/stack'
import { ContactFormScreen } from 'screens/contacts/ContactFormScreen'
import { ContactsProviderElement } from 'screens/contacts/ContactsContext'
import { ContactsScreen } from 'screens/contacts/ContactsScreen'
import { contactsStackRouteNames } from './types'

const Stack = createStackNavigator()

const screensOptions = { headerShown: false }

export const ContactsNavigation = () => {
  return (
    <ContactsProviderElement>
      <Stack.Navigator>
        <Stack.Screen
          name={contactsStackRouteNames.ContactsList}
          component={ContactsScreen}
          options={screensOptions}
        />
        <Stack.Screen
          name={contactsStackRouteNames.ContactForm}
          options={screensOptions}
          component={ContactFormScreen}
        />
      </Stack.Navigator>
    </ContactsProviderElement>
  )
}

export * from './types'
