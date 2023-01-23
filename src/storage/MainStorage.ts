import { Contact } from 'store/slices/contactsSlice/types'
import { MMKVStorage } from './MMKVStorage'

export const MainStorage = new MMKVStorage()

const pin = 'PIN'
const keyManagement = 'KEY_MANAGEMENT'
const keyVerificationReminder = 'KEY_VERIFICATION_REMINDER'
const contacts = 'CONTACTS'
const signup = 'SIGN_UP'

// pin functions
export const hasPin = () => MainStorage.has(pin)
export const getPin = (): string => MainStorage.get(pin)
export const deletePin = () => MainStorage.delete(pin)
export const savePin = (pinValue: string) => MainStorage.set(pin, pinValue)

//keys functions
export const hasKeys = () => MainStorage.has(keyManagement)
export const getKeys = (): string | undefined => MainStorage.get(keyManagement)
export const saveKeys = (keysValue: string) =>
  MainStorage.set(keyManagement, keysValue)
export const deleteKeys = () => MainStorage.delete(keyManagement)

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
// TODO define type for contacts
export const saveContacts = (value: Record<string, Contact>) =>
  MainStorage.set(contacts, value)
export const deleteContacts = () => MainStorage.delete(contacts)

// signup function
export const hasSignUP = () => MainStorage.has(signup)
export const getSignUP = () => MainStorage.get(signup)
export const saveSignUp = (value: { signup: boolean }) =>
  MainStorage.set(signup, value)
export const deleteSignUp = () => MainStorage.delete(signup)
