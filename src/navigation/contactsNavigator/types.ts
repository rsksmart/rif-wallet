import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Contact } from 'shared/types'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'

export type ContactsStackScreenProps<T extends keyof ContactStackParamsList> =
  CompositeScreenProps<
    StackScreenProps<ContactStackParamsList, T>,
    RootTabsScreenProps<rootTabsRouteNames.Contacts>
  >

export enum contactsStackRouteNames {
  ContactsList = 'ContactsList',
  ContactForm = 'ContactForm',
  ContactDetails = 'Contact details',
}

export type ContactStackParamsList = {
  [contactsStackRouteNames.ContactsList]: undefined
  [contactsStackRouteNames.ContactForm]:
    | { initialValue: Contact; proposed: boolean }
    | undefined
  [contactsStackRouteNames.ContactDetails]: {
    contact: Contact
  }
}
