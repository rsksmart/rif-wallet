import { Contact } from 'shared/types'

import { MMKVStorage } from './MMKVStorage'

export const MainStorage = new MMKVStorage()

const keyVerificationReminder = 'KEY_VERIFICATION_REMINDER'
const keyManagement = 'KEY_MANAGEMNT'
const contacts = 'CONTACTS'
const closeStart = 'CLOSE_GETTING_STARTED'

//emulator keys functions
export const getKeysFromMMKV = (): string | undefined =>
  MainStorage.get(keyManagement)
export const saveKeysInMMKV = (value: string) =>
  MainStorage.set(keyManagement, value)

// keyVerificationReminder functions
export const hasKeyVerificationReminder = () =>
  MainStorage.has(keyVerificationReminder)
export const getKeyVerificationReminder = () => {
  return MainStorage.get(keyVerificationReminder) === 'true'
}
export const saveKeyVerificationReminder = (value: boolean) =>
  MainStorage.set(keyVerificationReminder, value.toString())

// contacts functions
export const hasContacts = () => MainStorage.has(contacts)
export const getContacts = () => MainStorage.get(contacts)
export const saveContacts = (value: Record<string, Contact>) =>
  MainStorage.set(contacts, value)
export const deleteContacts = () => MainStorage.delete(contacts)

// close get started function
export const hasIsGettingStartedClosed = () => MainStorage.has(closeStart)
export const getIsGettingStartedClosed = () => MainStorage.get(closeStart)
export const saveIsGettingStartedClosed = (value: { close: boolean }) =>
  MainStorage.set(closeStart, value)
export const deleteIsGettingStartedClosed = () => MainStorage.delete(closeStart)

// general function
export const resetMainStorage = () => MainStorage.deleteAll()
