import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  const { top } = useSafeAreaInsets()

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
        options={{ header: props => <AppHeader {...props} /> }}
      />
      <Stack.Screen
        name={contactsStackRouteNames.ContactForm}
        component={ContactFormScreen}
        options={screenOptionsWithHeader(top, undefined, sharedColors.black)}
      />
      <Stack.Screen
        name={contactsStackRouteNames.ContactDetails}
        component={ContactDetails}
        options={screenOptionsWithHeader(
          top,
          undefined,
          sharedColors.background.secondary,
        )}
      />
    </Stack.Navigator>
  )
}

export * from './types'
