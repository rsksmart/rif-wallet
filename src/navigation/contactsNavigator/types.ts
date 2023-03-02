import { StackScreenProps } from '@react-navigation/stack'

import { Contact } from 'shared/types'

export type ContactsStackScreenProps<T extends keyof ContactStackParamsList> =
  StackScreenProps<ContactStackParamsList, T>

export enum contactsStackRouteNames {
  ContactsList = 'ContactsList',
  ContactForm = 'ContactForm',
}

export type ContactStackParamsList = {
  [contactsStackRouteNames.ContactsList]: undefined
  [contactsStackRouteNames.ContactForm]: { initialValue: Contact } | undefined
}
