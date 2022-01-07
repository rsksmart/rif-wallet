import { createStore } from './NormalStore'

const key = 'CONTACTS'
const ContactsStore = createStore(key)

export const hasContacts = ContactsStore.has
export const getContacts = ContactsStore.get
export const saveContacts = ContactsStore.save
export const deleteContacts = ContactsStore.remove
