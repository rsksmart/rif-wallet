import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'

import { ContactsScreen, ContactDetails } from 'screens/contacts'
import { ContactFormScreen } from 'screens/contacts/ContactFormScreen'
import { sharedColors } from 'shared/constants'
import { AppHeader } from 'src/ux/appHeader'

import { contactsStackRouteNames, ContactStackParamsList } from './types'
import { screenOptionsWithHeader } from '..'
import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'

const Stack = createStackNavigator<ContactStackParamsList>()

export const ContactsNavigation = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Contacts>) => {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={contactsStackRouteNames.ContactsList}
        component={ContactsScreen}
        options={{ header: props => <AppHeader isShown={true} {...props} /> }}
      />
      <Stack.Screen
        name={contactsStackRouteNames.ContactForm}
        component={ContactFormScreen}
        options={screenOptionsWithHeader(undefined, sharedColors.black)}
      />
      <Stack.Screen
        name={contactsStackRouteNames.ContactDetails}
        component={ContactDetails}
        options={screenOptionsWithHeader(undefined, sharedColors.inputInactive)}
      />
    </Stack.Navigator>
  )
}

export * from './types'
