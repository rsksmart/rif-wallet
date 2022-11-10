import { MMKVStorage } from './MMKVStorage'

export interface IProfileStore {
  alias: string
  phone: string
  email: string
}

export const MainStorage = new MMKVStorage()

const pin = 'PIN'
const profile = 'PROFILE'
const keyManagement = 'KEY_MANAGEMENT'
const keyVerificationReminder = 'KEY_VERIFICATION_REMINDER'
const contacts = 'CONTACTS'

// pin functions
export const hasPin = () => MainStorage.has()
export const getPin = (): string => MainStorage.get(pin)
export const deletePin = () => MainStorage.delete(pin)
export const savePin = (pinValue: string) => MainStorage.set(pin, pinValue)

// profile functions
export const hasProfile = () => MainStorage.has(profile)
export const getProfile = () => {
  const profileReturned = MainStorage.get(profile) || {}
  return profileReturned
}
export const deleteProfile = () => MainStorage.delete(profile)
export const saveProfile = (profileValue: IProfileStore) =>
  MainStorage.set(profile, JSON.stringify(profileValue))

//keys functions
export const hasKeys = () => MainStorage.has(keyManagement)
export const getKeys = () => MainStorage.get(keyManagement)
export const saveKeys = (keysValue: string) =>
  MainStorage.set(keyManagement, keysValue)
export const deleteKeys = MainStorage.deleteAll

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
export const saveContacts = (value: any) => MainStorage.set(contacts, value)
export const deleteContacts = () => MainStorage.delete(contacts)
