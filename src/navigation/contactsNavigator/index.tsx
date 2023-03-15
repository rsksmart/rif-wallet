import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'

import { useAppDispatch } from 'store/storeUtils'
import { changeTopColor } from 'store/slices/settingsSlice'
import { ContactsScreen } from 'screens/contacts'
import { ContactFormScreen } from 'screens/contacts/ContactFormScreen'
import { sharedColors } from 'shared/constants'

import { contactsStackRouteNames, ContactStackParamsList } from './types'

const Stack = createStackNavigator<ContactStackParamsList>()

const screensOptions = { headerShown: false }

export const ContactsNavigation = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(changeTopColor(sharedColors.black))
  }, [dispatch])

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={contactsStackRouteNames.ContactsList}
        component={ContactsScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name={contactsStackRouteNames.ContactForm}
        component={ContactFormScreen}
        options={screensOptions}
      />
    </Stack.Navigator>
  )
}

export * from './types'
