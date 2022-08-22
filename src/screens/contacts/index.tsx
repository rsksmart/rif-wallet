import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { NavigationProp } from '../../RootNavigation'
import { ContactFormScreen } from './ContactFormScreen'
import { ContactsProviderElement } from './ContactsContext'
import { ContactsScreen } from './ContactsScreen'

const Stack = createStackNavigator()

const screensOptions = { headerShown: false }

export type ContactsScreenProps = {
  navigation: NavigationProp
}

export const ContactsNavigationScreen: React.FC<ContactsScreenProps> = ({
  navigation,
}) => {
  // TODO: get chainId from wallet
  const chainId = 31
  return (
    <ContactsProviderElement>
      <Stack.Navigator initialRouteName={'ContactsList'}>
        <Stack.Screen
          name="ContactsList"
          component={ContactsScreen}
          options={screensOptions}
        />
        <Stack.Screen name="ContactForm" options={screensOptions}>
          {props => (
            <ContactFormScreen
              {...props}
              navigation={navigation}
              chainId={chainId}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </ContactsProviderElement>
  )
}
