import { Store } from './Store'

const key = 'CONTACTS'
const ContactsStore = new Store(key)

export const hasContacts = ContactsStore.has
export const getContacts = ContactsStore.get
export const saveContacts = ContactsStore.get
export const deleteContacts = ContactsStore.deleteAll
