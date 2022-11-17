import { StackScreenProps } from '@react-navigation/stack'
import { IContact } from 'src/screens/contacts/ContactsContext'

export type ContactsStackScreenProps<T extends keyof ContactStackParamsList> =
  StackScreenProps<ContactStackParamsList, T>

export enum contactsStackRouteNames {
  ContactsList = 'ContactsList',
  ContactForm = 'ContactForm',
}

export type ContactStackParamsList = {
  [contactsStackRouteNames.ContactsList]: undefined
  [contactsStackRouteNames.ContactForm]: { initialValue: IContact } | undefined
}
