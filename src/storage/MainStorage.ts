import { Store } from './Store'

export interface IProfileStore {
  alias: string
  phone: string
  email: string
}

export const MainStorage = new Store()

const pin = 'PIN'
const profile = 'PROFILE'
const keyManagement = 'KEY_MANAGEMENT'

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
