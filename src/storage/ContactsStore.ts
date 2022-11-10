import { MMKVStorage } from './MMKVStorage'

const key = 'CONTACTS'
const ContactsStore = new MMKVStorage(key)

export const hasContacts = ContactsStore.has
export const getContacts = ContactsStore.get
export const saveContacts = ContactsStore.get
export const deleteContacts = ContactsStore.deleteAll
